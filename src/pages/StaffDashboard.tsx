import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QuickStats } from "@/components/QuickStats";
import { SubmissionsTable } from "@/components/SubmissionsTable";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CreateTaskDrawer, type CreateTaskPayload } from "@/components/CreateTaskDrawer";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskCommentPanel } from "@/components/TaskCommentPanel";
import { TeamPresence } from "@/components/TeamPresence";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { SpringButton } from "@/components/SpringButton";
import { useTasks, useNotifications, useTeamPresence } from "@/stores/useAppStore";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Task } from "@/types/academic";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function StaffDashboard() {
  const user = useAuthUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);

  const { tasks, submissions, createTask, moveSubmission, addComment, isCreating, fetchTasks, fetchSubmissions } = useTasks();
  // Removed addNotification to prevent the UI crash
  const { notifications, unreadCount, markAsRead, markAllRead, fetchNotifications } = useNotifications();
  const { members } = useTeamPresence();

  const defaultUnitId = import.meta.env.VITE_DEFAULT_UNIT_ID as string | undefined;

  useEffect(() => {
    fetchTasks(defaultUnitId ?? "");
    fetchSubmissions(); //  NEW
    fetchNotifications();
  }, [fetchTasks, fetchSubmissions, fetchNotifications, defaultUnitId]);

  const selectedTask = tasks.find(t => String(t.id) === String(selectedTaskId)) || null;

  const handleCreateTask = async (taskData: CreateTaskPayload) => {
    try {
      // 1. Django strictly expects Title Case ("High", "Medium", "Low")
      const formattedPriority = taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1);

      // 2. Pass EXACTLY the keys Django's TaskSerializer expects
      await createTask({
        title: taskData.title,
        description: taskData.description,
        unit: taskData.unit, 
        priority: formattedPriority, 
        due_date: taskData.due_date, 
        allow_late_submissions: taskData.allow_late_submissions,
      } as any); // Cast as 'any' temporarily so your Zustand store types don't throw a TS error
      
      // We removed addNotification here. The Toast is all we need!
      toast.success("Task created", { description: `"${taskData.title}" has been assigned.` });

    } catch (error) {
      toast.error("Failed to create task", { description: "An error occurred." });
      console.error("Local Error:", error);
    }
  };

  const handleSelectTask = (kanbanTask: Task) => {
    // 🔍 Find the original submission to get the actual parent Task ID
    const submission = submissions?.find(s => String(s.id) === String(kanbanTask.id));
    
    if (submission) {
      setSelectedTaskId(String(submission.task));
    } else {
      // Fallback in case it's a direct task card
      setSelectedTaskId(kanbanTask.id);
    }
    
    setCommentOpen(true);
  };


  // Map submissions into visual "Task Cards" for the Staff Kanban
  const staffKanbanTasks: Task[] = (submissions || []).map(sub => {
    const parentTask = tasks.find(t => String(t.id) === String(sub.task));
    const studentName = (sub as any).student_name || `Student ID: ${sub.student}`;
    return {
      id: String(sub.id), // Critical: We use the SUBMISSION ID so it moves the submission, not the task!
      unitId: parentTask?.unitId || "",
      title: `${studentName} - ${parentTask?.title || "Submission"}`,
      description: `Link: ${sub.submission_link}`,
      status: sub.status,
      priority: parentTask?.priority || "medium",
      dueDate: sub.submitted_at || new Date().toISOString(),
    } as Task;
  });






  // Map the real submissions to the UI Table
  const recentSubmissions = (submissions || []).map(sub => {
    // Find the parent task so we can display its title
    const parentTask = tasks.find(t => String(t.id) === String(sub.task));
    
    return {
      id: String(sub.id),
      // We will use the ID until we update the backend serializer to send the real name later
      studentName: (sub as any).student_name || `Student ID: ${sub.student}`, 
      taskTitle: parentTask?.title || "Loading Task...",
      submittedAt: sub.submitted_at || new Date().toISOString(),
      status: sub.status === "done" ? ("graded" as const) : ("pending" as const),
      link: sub.submission_link || "#",
      platform: (sub.submission_link || "").includes("drive") ? "Google Drive" : "Cloud Storage"
    };
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50">
        <AppSidebar role="staff" />
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <div className="flex-1">
              <h2 className="text-sm font-bold tracking-tight">Staff Dashboard</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {user?.username ?? "Staff"} — School of Engineering
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <TeamPresence members={members} />
              <div className="h-4 w-[1px] bg-border/60 mx-1" />
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllRead={markAllRead}
              />
              <SpringButton size="sm" onClick={() => setDrawerOpen(true)} className="rounded-xl shadow-lg shadow-primary/20">
                <Plus className="mr-1 h-4 w-4" />
                Create Task
              </SpringButton>
            </div>
          </header>

          <main className="flex-1 space-y-8 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <QuickStats />
            </motion.div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">Active Task Board</h3>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md">
                  {tasks.length} total tasks
                </span>
              </div>
              <KanbanBoard tasks={staffKanbanTasks} onMoveTask={moveSubmission} onSelectTask={handleSelectTask} />
            </section>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <SubmissionsTable submissions={recentSubmissions} />
              </div>
              <div className="space-y-8">
                <ActivityFeed />
              </div>
            </div>
          </main>
        </div>
      </div>

      <CreateTaskDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        onCreate={handleCreateTask} 
        isCreating={isCreating} 
      />
      
      <TaskCommentPanel 
        task={selectedTask} 
        open={commentOpen} 
        onOpenChange={setCommentOpen} 
        onAddComment={addComment} 
      />
    </SidebarProvider>
  );
}