import { GlassCard } from "@/components/GlassCard";
import { TrendingUp, Clock, FileCheck, AlertTriangle } from "lucide-react";

const stats = [
  {
    label: "Submission Rate",
    value: "87%",
    change: "+4.2%",
    trend: "up" as const,
    icon: TrendingUp,
    description: "This week",
  },
  {
    label: "On-Time Ratio",
    value: "92%",
    change: "+1.8%",
    trend: "up" as const,
    icon: Clock,
    description: "Last 30 days",
  },
  {
    label: "Pending Reviews",
    value: "24",
    change: "3 urgent",
    trend: "neutral" as const,
    icon: FileCheck,
    description: "Awaiting feedback",
  },
  {
    label: "Overdue Feedback",
    value: "6",
    change: "-2",
    trend: "down" as const,
    icon: AlertTriangle,
    description: "Past deadline",
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <GlassCard
          key={stat.label}
          variant="strong"
          className="relative overflow-hidden"
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium">
            <span className={stat.trend === "up" ? "text-status-graded" : stat.trend === "down" ? "text-destructive" : "text-muted-foreground"}>
              {stat.change}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
