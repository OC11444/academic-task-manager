import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SpringButton } from "@/components/SpringButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { Task, Comment } from "@/stores/mockData";

interface TaskCommentPanelProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComment: (taskId: string, content: string, author: string, avatar: string) => void;
}

function getCountdown(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { text: "Overdue", urgent: true };
  const hours = Math.floor(diff / 3600_000);
  if (hours < 1) return { text: `${Math.floor(diff / 60_000)}m left`, urgent: true };
  if (hours < 24) return { text: `${hours}h left`, urgent: true };
  const days = Math.floor(hours / 24);
  return { text: `${days}d left`, urgent: false };
}

export function TaskCommentPanel({ task, open, onOpenChange, onAddComment }: TaskCommentPanelProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [task?.comments.length]);

  if (!task) return null;

  const countdown = getCountdown(task.deadline);

  const handleSend = () => {
    if (!message.trim()) return;
    onAddComment(task.id, message.trim(), "You", "YU");
    setMessage("");
  };

  const statusMap: Record<string, "ontime" | "late" | "pending" | "graded"> = {
    todo: "pending",
    in_progress: "ontime",
    done: "graded",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg">{task.title}</SheetTitle>
          <SheetDescription className="text-sm">{task.unit}</SheetDescription>
        </SheetHeader>

        {/* Task meta */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={statusMap[task.status] || "pending"} />
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold",
              countdown.urgent
                ? "border-destructive/20 bg-destructive/10 text-destructive"
                : "border-border bg-muted/50 text-muted-foreground"
            )}
          >
            <Clock className="h-3 w-3" />
            {countdown.text}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm font-medium text-muted-foreground scholarly">{task.description}</p>

        {/* Thread */}
        <div ref={scrollRef} className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-lg bg-muted/30 p-3">
          {task.comments.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No comments yet. Start the conversation ✨
            </p>
          )}
          {task.comments.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                "flex gap-3 transition-opacity",
                comment.isOptimistic && "opacity-60"
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">{comment.avatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{comment.author}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-3 flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-10"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            aria-label="Type a comment"
          />
          <SpringButton size="icon" onClick={handleSend} disabled={!message.trim()} aria-label="Send comment">
            <Send className="h-4 w-4" />
          </SpringButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
