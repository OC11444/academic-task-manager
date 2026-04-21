import { useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/stores/useAppStore";
import { formatDistanceToNow } from "date-fns"; // For that "2m ago" feel

export function ActivityFeed() {
  // 1. Hook into the Social section of our Global Memory
  const { notifications, fetchNotifications, isLoading } = useNotifications();

  // 2. Fetch the latest activity when the component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Optional: Set up a "Heartbeat" to refresh the feed every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <GlassCard variant="strong" className="space-y-1 p-0">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          {/* The pulsing dot stays! It signals the "Live" connection */}
          <span className="h-2 w-2 animate-pulse-soft rounded-full bg-status-graded" />
          <h3 className="text-sm font-semibold">Live Activity</h3>
        </div>
      </div>
      
      <div className="space-y-0.5 p-2">
        {isLoading && notifications.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            Listening for activity...
          </div>
        ) : (
          notifications.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors",
                !activity.read && "bg-primary/5" // Use "unread" as the "Live/New" highlight
              )}
            >
              {/* This dot represents the activity line */}
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/30" />
              
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.title || "System"}</span>{" "}
                  <span className="text-muted-foreground">{activity.message}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {/* Transforms real timestamps into "5m ago" */}
                  {activity.createdAt 
                    ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                    : "Just now"}
                </p>
              </div>
            </div>
          ))
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No recent activity to show.
          </div>
        )}
      </div>
    </GlassCard>
  );
}