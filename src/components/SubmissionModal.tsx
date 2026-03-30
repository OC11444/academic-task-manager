import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LinkValidator } from "@/components/LinkValidator";
import { SpringButton } from "@/components/SpringButton";
import { AlertTriangle } from "lucide-react";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLate?: boolean;
}

const mockAssignments = [
  { id: "1", title: "Research Proposal Draft" },
  { id: "2", title: "Literature Review Ch.2" },
  { id: "3", title: "Data Analysis Report" },
];

export function SubmissionModal({ open, onOpenChange, isLate = false }: SubmissionModalProps) {
  const [link, setLink] = useState("");
  const [assignment, setAssignment] = useState("");
  const [notes, setNotes] = useState("");

  const isValidLink = /drive\.google\.com|docs\.google\.com|dropbox\.com|onedrive\.live\.com|1drv\.ms|sharepoint\.com/.test(link);

  const handleSubmit = () => {
    if (!isValidLink || !assignment) return;
    // Mock submit
    onOpenChange(false);
    setLink("");
    setAssignment("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Submit Assignment</DialogTitle>
          <DialogDescription>
            Share your work via a cloud storage link.
          </DialogDescription>
        </DialogHeader>

        {isLate && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-destructive">Deadline Passed</p>
              <p className="text-xs text-muted-foreground">
                Note: This will be flagged as a late submission.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="assignment-select">Assignment</Label>
            <Select value={assignment} onValueChange={setAssignment}>
              <SelectTrigger id="assignment-select" aria-label="Select assignment">
                <SelectValue placeholder="Select an assignment..." />
              </SelectTrigger>
              <SelectContent>
                {mockAssignments.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Submission Link</Label>
            <LinkValidator value={link} onChange={setLink} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any comments for your lecturer..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <SpringButton variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </SpringButton>
            <SpringButton
              onClick={handleSubmit}
              disabled={!isValidLink || !assignment}
            >
              Submit Work
            </SpringButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
