import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QuickStats } from "@/components/QuickStats";
import { SubmissionsTable } from "@/components/SubmissionsTable";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CreateTaskDrawer } from "@/components/CreateTaskDrawer";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskCommentPanel } from "@/components/TaskCommentPanel";
import { TeamPresence } from "@/components/TeamPresence";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { MultiplayerCursors } from "@/components/MultiplayerCursors";
import { SpringButton } from "@/components/SpringButton";
import { useTasks, useNotifications, useTeamPresence } from "@/stores/useAppStore";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Task } from "@/stores/mockData";

export default function StaffDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const { tasks, createTask, moveTask, addComment, isCreating } = useTasks();
  const { notifications, unreadCount, markAsRead, markAllRead, addNotification } = useNotifications();
  const { members, onlineMembers } = useTeamPresence();

  const handleCreateTask = async (task: Parameters<typeof createTask>[0]) => {
    const newTask = await createTask(task);
    toast.success("Task created", { description: `"${newTask.title}" has been assigned.` });
    addNotification({
      title: "New Task Created",
      body: `You created "${newTask.title}".`,
      time: new Date(),
      read: false,
      type: "task",
    });
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setCommentOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="staff" />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-sm">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold">Staff Dashboard</h2>
              <p className="text-xs text-muted-foreground">Good morning, Dr. Patel</p>
            </div>
            <TeamPresence members={members} />
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllRead={markAllRead}
            />
            <SpringButton size="sm" onClick={() => setDrawerOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Create Task
            </SpringButton>
          </header>

          <main className="flex-1 space-y-6 p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <QuickStats />
            </motion.div>

            {/* Kanban */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Task Board</h3>
              <KanbanBoard tasks={tasks} onMoveTask={moveTask} onSelectTask={handleSelectTask} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <SubmissionsTable />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
          </main>
        </div>
      </div>

      <MultiplayerCursors members={onlineMembers} />
      <CreateTaskDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onCreate={handleCreateTask} isCreating={isCreating} />
      <TaskCommentPanel task={selectedTask} open={commentOpen} onOpenChange={setCommentOpen} onAddComment={addComment} />
    </SidebarProvider>
  );
}
