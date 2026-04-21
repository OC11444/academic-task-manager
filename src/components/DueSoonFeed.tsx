import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/stores/useAppStore";
import { formatDistanceToNow, differenceInHours, parseISO } from "date-fns";
import type { Task } from "@/types/academic";

interface DueSoonFeedProps {
  unitId: string;
}

// 🎨 Maia Urgency Styling Logic
function getUrgencyStyles(hours: number) {
  if (hours <= 0) return "text-destructive bg-destructive/10 border-destructive/20"; // Overdue
  if (hours <= 6) return "text-destructive bg-destructive/10 border-destructive/20"; // Urgent
  if (hours <= 24) return "text-status-pending bg-status-pending/10 border-status-pending/20"; // Today
  return "text-muted-foreground bg-muted/50 border-border"; // This week
}

export function DueSoonFeed({ unitId }: DueSoonFeedProps) {
  const { tasks, fetchTasks } = useTasks();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (unitId) {
      setIsFetching(true);
      fetchTasks(unitId).finally(() => {
        setIsFetching(false);
      });
    }
  }, [fetchTasks, unitId]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "done") 
      .map((t) => {
        // 🛠️ FIX: Try both camelCase and snake_case for the date
        const rawDate = (t as any).due_date || t.dueDate;
        
        // If no date exists, we default to "now" so it doesn't break, 
        // but it will show as overdue if the field is missing.
        const dueDateObj = rawDate ? parseISO(rawDate) : new Date();
        const hoursLeft = rawDate ? differenceInHours(dueDateObj, new Date()) : -1;

        return { ...t, hoursLeft, displayDate: rawDate };
      })
      .sort((a, b) => a.hoursLeft - b.hoursLeft)
      .slice(0, 5); 
  }, [tasks]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">Due Soon</h3>
      
      <div className="space-y-2">
        {isFetching && (
          <p className="py-4 text-center text-sm text-muted-foreground animate-pulse">
            Checking the calendar...
          </p>
        )}

        {!isFetching && upcomingTasks.length === 0 && (
          <GlassCard variant="strong" className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No upcoming deadlines. Relax! ☕</p>
          </GlassCard>
        )}

        {upcomingTasks.map((item, i) => (
          <GlassCard
            key={item.id}
            variant="strong"
            className="flex items-center gap-4 p-4 transition-all hover:scale-[1.01]"
            transition={{ delay: i * 0.05 }}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                getUrgencyStyles(item.hoursLeft)
              )}
            >
              <Clock className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Unit: {item.unitId || unitId}
              </p>
            </div>

            <span
              className={cn(
                "shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter",
                getUrgencyStyles(item.hoursLeft)
              )}
            >
              {/* 🛠️ FIX: Only calculate distance if a real date exists */}
              {item.hoursLeft <= 0 
                ? "Overdue" 
                : item.displayDate 
                  ? formatDistanceToNow(parseISO(item.displayDate as string), { addSuffix: false })
                  : "No Date"}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}