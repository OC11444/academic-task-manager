import { cn } from "@/lib/utils";

type StatusType = "ontime" | "late" | "pending" | "graded";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; classes: string }> = {
  ontime: {
    label: "On Time",
    classes: "bg-primary/10 text-primary border-primary/20",
  },
  late: {
    label: "Late",
    classes: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pending: {
    label: "Pending",
    classes: "bg-status-pending/10 text-status-pending border-status-pending/20",
  },
  graded: {
    label: "Graded",
    classes: "bg-status-graded/10 text-status-graded border-status-graded/20",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold",
        config.classes,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || config.label}
    </span>
  );
}
