import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageSquare, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, TaskStatus, TeamMember } from "@/stores/mockData";
import { mockTeamMembers } from "@/stores/mockData";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "todo", label: "To Do", color: "border-status-pending/40" },
  { status: "in_progress", label: "In Progress", color: "border-primary/40" },
  { status: "done", label: "Done", color: "border-status-graded/40" },
];

function getCountdownText(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { text: "Overdue", urgent: true };
  const hours = Math.floor(diff / 3600_000);
  if (hours < 24) return { text: `${hours}h left`, urgent: true };
  return { text: `${Math.floor(hours / 24)}d left`, urgent: false };
}

const priorityDot: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-status-pending",
  low: "bg-status-graded",
};

function getMember(id: string): TeamMember | undefined {
  return mockTeamMembers.find((m) => m.id === id);
}

export function KanbanBoard({ tasks, onMoveTask, onSelectTask }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => setDraggedTaskId(taskId);

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      onMoveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className={cn("rounded-xl border-2 border-dashed p-3 transition-colors", col.color)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.status)}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h4 className="text-sm font-semibold">{col.label}</h4>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {colTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {colTasks.map((task) => {
                  const cd = getCountdownText(task.deadline);
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => onSelectTask(task)}
                      className="cursor-pointer"
                    >
                      <GlassCard
                        variant="strong"
                        className="space-y-2.5 p-3"
                        initial={false}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground/40" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-tight">{task.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{task.unit}</p>
                          </div>
                          <span className={cn("h-2 w-2 shrink-0 rounded-full", priorityDot[task.priority])} />
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[11px] font-medium",
                              cd.urgent ? "text-destructive" : "text-muted-foreground"
                            )}
                          >
                            <Clock className="h-3 w-3" />
                            {cd.text}
                          </span>
                          <div className="flex items-center gap-1">
                            {task.comments.length > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {task.comments.length}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Assignee avatars */}
                        <div className="flex -space-x-1.5">
                          {task.assignedTo.slice(0, 3).map((uid) => {
                            const m = getMember(uid);
                            if (!m) return null;
                            return (
                              <Avatar key={uid} className="h-6 w-6 border-2 border-card">
                                <AvatarFallback
                                  className="text-[10px]"
                                  style={{ backgroundColor: m.color, color: "#fff" }}
                                >
                                  {m.initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {task.assignedTo.length > 3 && (
                            <Avatar className="h-6 w-6 border-2 border-card">
                              <AvatarFallback className="text-[10px]">
                                +{task.assignedTo.length - 3}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Nothing here yet. Take a coffee break ☕
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
