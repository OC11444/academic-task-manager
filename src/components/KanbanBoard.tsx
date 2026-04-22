import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageSquare, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
// Using the academic types for consistency with the backend
import type { Task, TaskStatus } from "@/types/academic";
import { mockTeamMembers } from "@/stores/mockData";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  // Aligning exactly with Backend STATUS_CHOICES
  { status: "to_do" as TaskStatus, label: "To Do", color: "border-status-pending/40" },
  { status: "in_progress" as TaskStatus, label: "In Progress", color: "border-primary/40" },
  { status: "done" as TaskStatus, label: "Done", color: "border-status-graded/40" },
];

/**
 *  DEFENSIVE: Prevents the "White Screen" crash if date is missing
 */
function getCountdownText(dateInput: any) {
  if (!dateInput) return { text: "No Date", urgent: false };
  
  try {
    const deadline = new Date(dateInput);
    if (isNaN(deadline.getTime())) return { text: "Invalid Date", urgent: false };

    const diff = deadline.getTime() - Date.now();
    if (diff <= 0) return { text: "Overdue", urgent: true };
    
    const hours = Math.floor(diff / 3600_000);
    if (hours < 24) return { text: `${hours}h left`, urgent: true };
    return { text: `${Math.floor(hours / 24)}d left`, urgent: false };
  } catch (e) {
    return { text: "Date Error", urgent: false };
  }
}

const priorityDot: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-status-pending",
  low: "bg-status-graded",
};

function getMember(id: string) {
  return mockTeamMembers.find((m) => m.id === id);
}

export function KanbanBoard({ tasks, onMoveTask, onSelectTask }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  /**
   * 🛡️ NORMALIZATION: Matches "To Do" (Backend) with "todo" (Frontend)
   */
  const normalizeStatus = (status: string): string => {
    if (!status) return "to_do";
    const s = status.toLowerCase().trim();
    // Ensure the output matches our column status exactly: "to_do"
    if (s === "to_do" || s === "to do" || s === "todo") return "to_do";
    if (s === "in_progress" || s === "in progress") return "in_progress";
    return s;
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      onMoveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => {
        // Safe filter: uses normalization to avoid empty columns
        const colTasks = tasks.filter((t) => normalizeStatus(t.status) === col.status);
        
        return (
          <div
            key={col.status}
            className={cn("rounded-xl border-2 border-dashed p-3 min-h-[500px]", col.color)}
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
                  // 🛠️ Check for both due_date (API) and deadline (Mock)
                  const rawDate = (task as any).due_date || (task as any).deadline;
                  const cd = getCountdownText(rawDate);
                  
                  // Safe access for assignees
                  const assignees = Array.isArray(task.assignedTo) ? task.assignedTo : [];

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={() => setDraggedTaskId(task.id)}
                      onClick={() => onSelectTask(task)}
                      className="cursor-pointer"
                    >
                      <GlassCard variant="strong" className="space-y-2.5 p-3">
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground/40" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-tight truncate">{task.title}</p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                              { (task as any).unit_code || "Task" }
                            </p>
                          </div>
                          <span className={cn("h-2 w-2 shrink-0 rounded-full", priorityDot[task.priority?.toLowerCase()] || priorityDot.medium)} />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", cd.urgent ? "text-destructive" : "text-muted-foreground")}>
                            <Clock className="h-3 w-3" />
                            {cd.text}
                          </span>
                          {task.comments && task.comments.length > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {task.comments.length}
                            </span>
                          )}
                        </div>

                        <div className="flex -space-x-1.5">
                          {assignees.slice(0, 3).map((uid: string) => {
                            const m = getMember(uid);
                            if (!m) return null;
                            return (
                              <Avatar key={uid} className="h-6 w-6 border-2 border-card">
                                <AvatarFallback className="text-[10px]" style={{ backgroundColor: m.color, color: "#fff" }}>
                                  {m.initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Nothing here yet ☕
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}