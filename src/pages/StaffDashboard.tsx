import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QuickStats } from "@/components/QuickStats";
import { SubmissionsTable } from "@/components/SubmissionsTable";
import { ActivityFeed } from "@/components/ActivityFeed";
import { motion } from "framer-motion";

export default function StaffDashboard() {
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
          </header>

          <main className="flex-1 space-y-6 p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <QuickStats />
            </motion.div>

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
    </SidebarProvider>
  );
}
