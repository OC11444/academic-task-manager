import { Bell, FileText, MessageSquare, Clock, Award } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
// 1. Import the official Notification type
import type { Notification } from "@/types/academic";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

// Maps backend types to our Maia icon set
const typeIcon: Record<string, typeof Bell> = {
  task: FileText,
  comment: MessageSquare,
  deadline: Clock,
  grade: Award,
};

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllRead,
}: NotificationDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={`Notifications: ${unreadCount} unread`}
        >
          <Bell className="h-5 w-5" />
          {/* Unread Badge with Maia colors */}
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="rounded-full bg-muted p-3 mb-2">
                <Bell className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">
                All caught up! ✨
              </p>
            </div>
          )}
          
          {notifications.map((n) => {
            const Icon = typeIcon[n.type] || Bell;
            return (
              <button
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border/40 last:border-0",
                  !n.read ? "bg-primary/[0.03] hover:bg-primary/[0.06]" : "hover:bg-muted/30"
                )}
              >
                {/* Icon Container */}
                <div className={cn(
                  "mt-0.5 rounded-xl p-2",
                  !n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  {/* Backend 'title' or 'senderName' */}
                  <p className={cn("text-sm leading-snug", !n.read ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                    {n.title}
                  </p>
                  {/* Backend 'message' */}
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {(() => {
                      // 🛠️ FIX: Handle both camelCase and snake_case naming
                      const rawDate = n.createdAt || (n as any).created_at;
                      const parsedDate = rawDate ? new Date(rawDate) : null;

                      // Only format if the date is actually valid
                      if (parsedDate && !isNaN(parsedDate.getTime())) {
                        return formatDistanceToNow(parsedDate, { addSuffix: true });
                      }
                      return "Just now"; // Fallback so we don't crash
                    })()}
                  </p>
                </div>

                {/* Unread indicator dot */}
                {!n.read && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}