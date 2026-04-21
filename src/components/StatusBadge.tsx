import { cn } from "@/lib/utils";

// We export this type so other components (like the Submissions Table) 
// know exactly what statuses the UI can "paint."
export type StatusType = "ontime" | "late" | "pending" | "graded" | "todo" | "in_progress" | "done";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

// Added Task Statuses (todo, in_progress, done) to the config 
// so you can use this same badge on the Kanban Board if you want!
const statusConfig: Record<StatusType, { label: string; classes: string }> = {
  ontime: {
    label: "On Time",
    classes: "bg-status-graded/10 text-status-graded border-status-graded/20",
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
    classes: "bg-primary/10 text-primary border-primary/20",
  },
  // Task Board Statuses
  todo: {
    label: "To Do",
    classes: "bg-muted text-muted-foreground border-border",
  },
  in_progress: {
    label: "In Progress",
    classes: "bg-primary/10 text-primary border-primary/20",
  },
  done: {
    label: "Completed",
    classes: "bg-status-graded/10 text-status-graded border-status-graded/20",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  // 🛡️ Fallback to 'pending' if the backend sends a status we don't recognize
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-all",
        config.classes,
        className
      )}
    >
      {/* The "Live" dot inside the badge */}
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || config.label}
    </span>
  );
}