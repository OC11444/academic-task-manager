import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";

interface Submission {
  id: string;
  student: string;
  assignment: string;
  submittedAt: string;
  status: "ontime" | "late" | "pending" | "graded";
  link: string;
  platform: string;
}

const mockSubmissions: Submission[] = [
  { id: "1", student: "Amara Osei", assignment: "Research Proposal Draft", submittedAt: "2h ago", status: "ontime", link: "#", platform: "Google Drive" },
  { id: "2", student: "Kenji Tanaka", assignment: "Literature Review Ch.2", submittedAt: "5h ago", status: "late", link: "#", platform: "Dropbox" },
  { id: "3", student: "Sofia Martinez", assignment: "Data Analysis Report", submittedAt: "1d ago", status: "graded", link: "#", platform: "OneDrive" },
  { id: "4", student: "Liam Chen", assignment: "Research Proposal Draft", submittedAt: "Just now", status: "pending", link: "#", platform: "Google Drive" },
  { id: "5", student: "Fatima Al-Rashid", assignment: "Methodology Section", submittedAt: "3h ago", status: "ontime", link: "#", platform: "Google Drive" },
  { id: "6", student: "Marcus Johnson", assignment: "Literature Review Ch.2", submittedAt: "12h ago", status: "late", link: "#", platform: "Dropbox" },
];

export function SubmissionsTable() {
  return (
    <div className="glass-strong rounded-lg">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold">Recent Submissions</h3>
        <p className="text-sm text-muted-foreground">Review and grade student work</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Assignment</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSubmissions.map((sub) => (
            <TableRow key={sub.id} className="group transition-colors hover:bg-muted/30">
              <TableCell className="font-medium">{sub.student}</TableCell>
              <TableCell className="text-muted-foreground">{sub.assignment}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{sub.platform}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{sub.submittedAt}</TableCell>
              <TableCell>
                <StatusBadge status={sub.status} />
              </TableCell>
              <TableCell>
                <button
                  className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Open ${sub.student}'s submission`}
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
