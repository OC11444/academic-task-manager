import { GlassCard } from "@/components/GlassCard";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DueItem {
  id: string;
  title: string;
  course: string;
  dueIn: string;
  hoursLeft: number;
}

const dueItems: DueItem[] = [
  { id: "1", title: "Research Proposal Draft", course: "CS 601", dueIn: "4 hours", hoursLeft: 4 },
  { id: "2", title: "Literature Review Ch.2", course: "ENG 520", dueIn: "1 day", hoursLeft: 24 },
  { id: "3", title: "Data Analysis Report", course: "STAT 430", dueIn: "3 days", hoursLeft: 72 },
  { id: "4", title: "Methodology Section", course: "CS 601", dueIn: "5 days", hoursLeft: 120 },
];

function getUrgency(hours: number) {
  if (hours <= 6) return "text-destructive bg-destructive/10 border-destructive/20";
  if (hours <= 24) return "text-status-pending bg-status-pending/10 border-status-pending/20";
  return "text-muted-foreground bg-muted/50 border-border";
}

export function DueSoonFeed() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Due Soon</h3>
      <div className="space-y-2">
        {dueItems.map((item, i) => (
          <GlassCard
            key={item.id}
            variant="strong"
            className="flex items-center gap-4 p-4"
            transition={{ delay: i * 0.05 }}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                getUrgency(item.hoursLeft)
              )}
            >
              <Clock className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.course}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold",
                getUrgency(item.hoursLeft)
              )}
            >
              {item.dueIn}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
