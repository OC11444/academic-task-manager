import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DueSoonFeed } from "@/components/DueSoonFeed";
import { ActivityFeed } from "@/components/ActivityFeed";
import { SubmissionModal } from "@/components/SubmissionModal";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskCommentPanel } from "@/components/TaskCommentPanel";
import { TeamPresence } from "@/components/TeamPresence";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { SpringButton } from "@/components/SpringButton";
import { GlassCard } from "@/components/GlassCard";
import { useTasks, useNotifications, useTeamPresence, useReports } from "@/stores/useAppStore";
import { Upload, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
//  Use the real Academic type so we can talk to the backend
import type { Task } from "@/types/academic"; 
import { useAuthUser } from "@/hooks/useAuthUser";

export default function StudentDashboard() {
  const user = useAuthUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);

  // Grab the fetch functions and real data from the store
  const { tasks, moveTask, addComment, fetchTasks } = useTasks();
  const selectedTask = tasks.find(t => String(t.id) === String(selectedTaskId)) || null;
  const { notifications, unreadCount, markAsRead, markAllRead, fetchNotifications } = useNotifications();
  const { members } = useTeamPresence();
  const { report, fetchUnitReport } = useReports();

  //  Sarah's connection logic: Determine which unit to show
  const activeUnitId = import.meta.env.VITE_DEFAULT_UNIT_ID || "2";

  useEffect(() => {
    if (activeUnitId) {
      // 1. Initial Fetch
      fetchTasks(activeUnitId);
      fetchNotifications();
      fetchUnitReport(activeUnitId);

      // 2. Setup "WhatsApp" Heartbeat: Refresh every 5 seconds
      const heartbeat = setInterval(() => {
        fetchTasks(activeUnitId);
        fetchNotifications();
      }, 5000); 

      // 3. Clean up when the user leaves the page
      return () => clearInterval(heartbeat);
    }
  }, [activeUnitId, fetchTasks, fetchNotifications, fetchUnitReport]);

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(String(task.id));
    setCommentOpen(true);
  };

  // Dynamic Stats: Link the top cards to Sarah's actual report
  const studentStats = [
    { 
      label: "Submitted", 
      value: report?.pendingReviews?.toString() ?? "0", 
      icon: CheckCircle 
    },
    { 
      label: "Pending", 
      value: tasks.filter(t => t.status?.toLowerCase() !== 'done').length.toString(), 
      icon: Clock 
    },
    { 
      label: "Late", 
      value: report?.overdueFeedback?.toString() ?? "0", 
      icon: Upload 
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="student" />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-sm">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold">Student Dashboard</h2>
              <p className="text-xs text-muted-foreground">
                Welcome back, {user?.username || "Sarah"}
              </p>
            </div>
            <TeamPresence members={members} />
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllRead={markAllRead}
            />
            <SpringButton onClick={() => setModalOpen(true)} size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Submit Work
            </SpringButton>
          </header>

          <main className="flex-1 space-y-6 p-6">
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {studentStats.map((stat, i) => (
                <GlassCard
                  key={stat.label}
                  variant="strong"
                  className="flex items-center gap-3 p-4"
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">My Tasks</h3>
              {/* Ensure Kanban Board receives tasks */}
              <KanbanBoard tasks={tasks} onMoveTask={moveTask} onSelectTask={handleSelectTask} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DueSoonFeed unitId={activeUnitId} />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <SubmissionModal open={modalOpen} onOpenChange={setModalOpen} tasks={tasks} />
      
      {/* ⚠️ NOTE: This will show an error until we fix TaskCommentPanel next! */}
      <TaskCommentPanel 
        task={selectedTask} 
        open={commentOpen} 
        onOpenChange={setCommentOpen} 
        onAddComment={addComment} 
      />
    </SidebarProvider>
  );
}