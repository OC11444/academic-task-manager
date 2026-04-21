import { GlassCard } from "@/components/GlassCard";
import { TrendingUp, Clock, FileCheck, AlertTriangle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useReports } from "../stores/useAppStore";

export function QuickStats() {
  const { report, fetchUnitReport, isLoading } = useReports();

  useEffect(() => {
    fetchUnitReport("global");
  }, [fetchUnitReport]);

  const stats = useMemo(() => [
    {
      label: "Submission Rate",
      value: report?.submissionRate != null ? `${report.submissionRate}%` : "--",
      change: report?.submissionTrend != null ? `${report.submissionTrend > 0 ? '+' : ''}${report.submissionTrend}%` : "",
      trend: report?.submissionTrend != null ? (report.submissionTrend >= 0 ? "up" : "down") : "neutral",
      icon: TrendingUp,
      description: "This week",
    },
    {
      label: "On-Time Ratio",
      value: report?.onTimeRatio != null ? `${report.onTimeRatio}%` : "--",
      change: report?.onTimeTrend != null ? `${report.onTimeTrend > 0 ? '+' : ''}${report.onTimeTrend}%` : "",
      trend: report?.onTimeTrend != null ? (report.onTimeTrend >= 0 ? "up" : "down") : "neutral",
      icon: Clock,
      description: "Last 30 days",
    },
    {
      label: "Pending Reviews",
      // 🛡️ Safe check: If pendingReviews is missing, show "0"
      value: report?.pendingReviews?.toString() ?? "0",
      change: report?.urgentReviews != null ? `${report.urgentReviews} urgent` : "",
      trend: "neutral",
      icon: FileCheck,
      description: "Awaiting feedback",
    },
    {
      label: "Overdue Feedback",
      // 🛡️ Safe check: Prevent .toString() crash
      value: report?.overdueFeedback?.toString() ?? "0",
      change: report?.overdueTrend != null ? (report.overdueTrend > 0 ? `+${report.overdueTrend}` : report.overdueTrend.toString()) : "",
      trend: report?.overdueTrend != null ? (report.overdueTrend <= 0 ? "up" : "down") : "neutral",
      icon: AlertTriangle,
      description: "Past deadline",
    },
  ], [report]);

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
              <p className="text-3xl font-bold tracking-tight">
                {isLoading ? "..." : stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium">
            <span className={
              stat.trend === "up" ? "text-status-graded" : 
              stat.trend === "down" ? "text-destructive" : 
              "text-muted-foreground"
            }>
              {isLoading ? "" : stat.change}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}