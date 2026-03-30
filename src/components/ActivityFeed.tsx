import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  isLive?: boolean;
}

const activities: Activity[] = [
  { id: "1", user: "Amara O.", action: "submitted Research Proposal", time: "2m ago", isLive: true },
  { id: "2", user: "Dr. Patel", action: "graded Literature Review", time: "15m ago" },
  { id: "3", user: "Liam C.", action: "submitted Data Analysis", time: "1h ago" },
  { id: "4", user: "Sofia M.", action: "resubmitted Methodology", time: "2h ago" },
  { id: "5", user: "Dr. Kim", action: "created new assignment", time: "3h ago" },
];

export function ActivityFeed() {
  return (
    <GlassCard variant="strong" className="space-y-1 p-0">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse-soft rounded-full bg-status-graded" />
          <h3 className="text-sm font-semibold">Live Activity</h3>
        </div>
      </div>
      <div className="space-y-0.5 p-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors",
              activity.isLive && "bg-primary/5"
            )}
          >
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/30" />
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
