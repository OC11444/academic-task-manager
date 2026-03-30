import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DueSoonFeed } from "@/components/DueSoonFeed";
import { ActivityFeed } from "@/components/ActivityFeed";
import { SubmissionModal } from "@/components/SubmissionModal";
import { SpringButton } from "@/components/SpringButton";
import { GlassCard } from "@/components/GlassCard";
import { Upload, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const studentStats = [
  { label: "Submitted", value: "12", icon: CheckCircle },
  { label: "Pending", value: "3", icon: Clock },
  { label: "Late", value: "1", icon: Upload },
];

export default function StudentDashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="student" />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-sm">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold">Student Dashboard</h2>
              <p className="text-xs text-muted-foreground">Welcome back, Amara</p>
            </div>
            <SpringButton onClick={() => setModalOpen(true)} size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Submit Work
            </SpringButton>
          </header>

          <main className="flex-1 space-y-6 p-6">
            {/* Mini stats */}
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DueSoonFeed />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
          </main>
        </div>
      </div>

      <SubmissionModal open={modalOpen} onOpenChange={setModalOpen} isLate={false} />
    </SidebarProvider>
  );
}
