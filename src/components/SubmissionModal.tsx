import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LinkValidator } from "@/components/LinkValidator";
import { SpringButton } from "@/components/SpringButton";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
//import { useTasks } from "@/stores/useAppStore";
import { isAfter } from "date-fns";
import api from "@/lib/api";

import type { Task } from "@/types/academic";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTaskId?: string;
  tasks: Task[]; // 👈 NEW: Expect tasks as a prop
}

export function SubmissionModal({ open, onOpenChange, initialTaskId, tasks }: SubmissionModalProps) {
  
  // 2. Local State
  const [link, setLink] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Filter tasks that actually need a submission (Todo or In Progress)
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== "done");
  }, [tasks]);

  // 4. Calculate if the currently selected task is late (Defensive against API vs Mock data)
  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const rawDate = selectedTask ? ((selectedTask as any).due_date || (selectedTask as any).dueDate || (selectedTask as any).deadline) : null;
  const isLate = rawDate ? isAfter(new Date(), new Date(rawDate)) : false;
  
  const isValidLink = /drive\.google\.com|docs\.google\.com|dropbox\.com|onedrive\.live\.com|1drv\.ms|sharepoint\.com/.test(link);

  const handleSubmit = async () => {
    if (!isValidLink || !selectedTaskId) return;
    
    setIsSubmitting(true);
    try {
      // Send the real request to the backend using the exact Django router path
      await api.post("tasks/submissions/", {
        task: parseInt(selectedTaskId),
        submission_link: link,
      });

      onOpenChange(false);
      setLink("");
      setSelectedTaskId("");
      setNotes("");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong sm:max-w-lg rounded-3xl border-border/40">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">Submit Work</DialogTitle>
          </div>
          <DialogDescription className="text-balance">
            Upload your cloud storage link. Ensure sharing permissions are set to "Anyone with the link".
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic Late Warning */}
        {isLate && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-bold text-destructive">Late Submission</p>
              <p className="text-xs text-destructive/80 font-medium">
                The deadline for this task has passed. Your submission will be flagged for the lecturer.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6 pt-2">
          {/* Task Selection */}
          <div className="space-y-2">
            <Label htmlFor="assignment-select" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Select Task
            </Label>
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger id="assignment-select" className="h-12 rounded-xl border-border/50 bg-muted/20">
                <SelectValue placeholder="Which task are you submitting?" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableTasks.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">No active tasks found.</p>
                ) : (
                  availableTasks.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)} className="rounded-lg">
                      {a.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Link Input (The Bouncer) */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Submission Link
            </Label>
            <LinkValidator value={link} onChange={setLink} />
          </div>

          {/* Student Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Notes for Lecturer (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Please see page 4 for the updated bibliography..."
              className="resize-none rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-colors"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <SpringButton 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border/50"
            >
              Cancel
            </SpringButton>
            <SpringButton
              onClick={handleSubmit}
              disabled={!isValidLink || !selectedTaskId || isSubmitting}
              className="rounded-xl px-8"
            >
              {isSubmitting ? "Uploading..." : "Submit Project"}
            </SpringButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}