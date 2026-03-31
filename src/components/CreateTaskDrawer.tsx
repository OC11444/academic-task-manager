import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpringButton } from "@/components/SpringButton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockUnits, mockGroups, type Priority, type TaskStatus } from "@/stores/mockData";

interface CreateTaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: {
    title: string;
    description: string;
    unit: string;
    assignedTo: string[];
    priority: Priority;
    status: TaskStatus;
    deadline: Date;
  }) => Promise<unknown>;
  isCreating: boolean;
}

export function CreateTaskDrawer({ open, onOpenChange, onCreate, isCreating }: CreateTaskDrawerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState<Date>();

  const toggleGroup = (gId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(gId) ? prev.filter((g) => g !== gId) : [...prev, gId]
    );
  };

  const assignedMembers = mockGroups
    .filter((g) => selectedGroups.includes(g.id))
    .flatMap((g) => g.members);

  const handleSubmit = async () => {
    if (!title || !unit || !deadline) return;
    await onCreate({
      title,
      description,
      unit,
      assignedTo: [...new Set(assignedMembers)],
      priority,
      status: "todo",
      deadline,
    });
    setTitle("");
    setDescription("");
    setUnit("");
    setSelectedGroups([]);
    setPriority("medium");
    setDeadline(undefined);
    onOpenChange(false);
  };

  const priorityColors: Record<Priority, string> = {
    high: "bg-destructive/10 text-destructive border-destructive/30",
    medium: "bg-status-pending/10 text-status-pending border-status-pending/30",
    low: "bg-status-graded/10 text-status-graded border-status-graded/30",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">Create Task</SheetTitle>
          <SheetDescription>Assign work to your students and teams.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Unit */}
          <div className="space-y-2">
            <Label>Unit / Course</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger aria-label="Select unit">
                <SelectValue placeholder="Select a unit..." />
              </SelectTrigger>
              <SelectContent>
                {mockUnits.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Research Proposal Draft"
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description (Markdown)</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task requirements..."
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Assign to Group */}
          <div className="space-y-2">
            <Label>Assign to Team / Group</Label>
            <div className="flex flex-wrap gap-2">
              {mockGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => toggleGroup(g.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                    selectedGroups.includes(g.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                  aria-label={`Toggle ${g.name}`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {(["high", "medium", "low"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition-all",
                    priority === p
                      ? priorityColors[p]
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                  aria-label={`Set priority ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <SpringButton variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </SpringButton>
            <SpringButton
              onClick={handleSubmit}
              disabled={!title || !unit || !deadline || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </SpringButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
