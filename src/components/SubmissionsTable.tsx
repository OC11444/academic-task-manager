import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Files } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// 1. Updated Interface to match real Backend expectations
interface Submission {
  id: string;
  studentName: string;
  taskTitle: string;
  submittedAt: string; // ISO string from backend
  status: StatusType;
  link: string;
  platform: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  isLoading?: boolean;
}

export function SubmissionsTable({ submissions, isLoading }: SubmissionsTableProps) {
  return (
    <div className="glass-strong rounded-2xl border border-border/40 overflow-hidden">
      {/* Header Section */}
      <div className="border-b border-border/50 px-6 py-5 bg-muted/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Files className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold tracking-tight">Recent Submissions</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 ml-8">
          Review and grade student work across your courses
        </p>
      </div>

      <div className="relative">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="py-4 font-bold text-xs uppercase tracking-widest pl-6">Student</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Assignment</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Platform</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Submitted</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
              <TableHead className="w-16 pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground animate-pulse">
                  Fetching submissions...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <p className="text-sm text-muted-foreground">No submissions found yet. ☕</p>
                </TableCell>
              </TableRow>
            )}

            {submissions.map((sub) => (
              <TableRow key={sub.id} className="group transition-colors hover:bg-muted/20 border-border/40">
                <TableCell className="font-bold text-sm pl-6">{sub.studentName}</TableCell>
                <TableCell className="text-sm font-medium text-muted-foreground">
                  {sub.taskTitle}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold border border-border/50">
                    {sub.platform}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-medium text-muted-foreground">
                  {/* Convert the ISO string into relative time (e.g., "5h ago") */}
                  {sub.submittedAt ? formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true }) : "N/A"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={sub.status} />
                </TableCell>
                <TableCell className="pr-6">
                  {/* Opens the student's work in a new tab */}
                  <a
                    href={sub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground opacity-0 transition-all hover:bg-primary/10 hover:text-primary group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Open ${sub.studentName}'s work`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}