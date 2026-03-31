// Centralized mock data store for the Collab Task Manager

export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  unit: string;
  assignedTo: string[];
  priority: Priority;
  status: TaskStatus;
  deadline: Date;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: Date;
  isOptimistic?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  type: "task" | "comment" | "deadline" | "grade";
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  isOnline: boolean;
  cursorX?: number;
  cursorY?: number;
}

const now = new Date();
const hours = (h: number) => new Date(now.getTime() + h * 3600_000);

export const mockTeamMembers: TeamMember[] = [
  { id: "u1", name: "Amara Osei", initials: "AO", color: "hsl(245, 45%, 55%)", isOnline: true },
  { id: "u2", name: "Kenji Tanaka", initials: "KT", color: "hsl(160, 50%, 40%)", isOnline: true },
  { id: "u3", name: "Sofia Martinez", initials: "SM", color: "hsl(30, 60%, 50%)", isOnline: false },
  { id: "u4", name: "Liam Chen", initials: "LC", color: "hsl(0, 72%, 50%)", isOnline: true },
  { id: "u5", name: "Fatima Al-Rashid", initials: "FA", color: "hsl(85, 50%, 40%)", isOnline: false },
];

export const mockTasks: Task[] = [
  {
    id: "t1", title: "Research Proposal Draft", description: "Write the initial draft for the research proposal covering methodology and literature review.",
    unit: "CS 601", assignedTo: ["u1", "u2"], priority: "high", status: "in_progress",
    deadline: hours(4), createdAt: hours(-48), comments: [
      { id: "c1", taskId: "t1", author: "Dr. Patel", avatar: "DP", content: "Please include the updated dataset references.", createdAt: hours(-12) },
      { id: "c2", taskId: "t1", author: "Amara Osei", avatar: "AO", content: "Will do — uploading revised version tonight.", createdAt: hours(-6) },
    ],
  },
  {
    id: "t2", title: "Literature Review Ch.2", description: "Complete Chapter 2 of the literature review with at least 15 peer-reviewed sources.",
    unit: "ENG 520", assignedTo: ["u2", "u3"], priority: "medium", status: "todo",
    deadline: hours(24), createdAt: hours(-72), comments: [],
  },
  {
    id: "t3", title: "Data Analysis Report", description: "Run statistical analysis on survey data and prepare visualization charts.",
    unit: "STAT 430", assignedTo: ["u1", "u4"], priority: "low", status: "done",
    deadline: hours(72), createdAt: hours(-96), comments: [
      { id: "c3", taskId: "t3", author: "Sofia Martinez", avatar: "SM", content: "Charts look great! Minor fix on the axis labels needed.", createdAt: hours(-24) },
    ],
  },
  {
    id: "t4", title: "Methodology Section", description: "Draft the methodology section with research design justification.",
    unit: "CS 601", assignedTo: ["u5"], priority: "high", status: "todo",
    deadline: hours(6), createdAt: hours(-24), comments: [],
  },
  {
    id: "t5", title: "Peer Review Feedback", description: "Provide constructive feedback on team members' drafts.",
    unit: "ENG 520", assignedTo: ["u1", "u2", "u3"], priority: "medium", status: "in_progress",
    deadline: hours(48), createdAt: hours(-36), comments: [],
  },
];

export const mockNotifications: Notification[] = [
  { id: "n1", title: "New Task Assigned", body: "Dr. Patel assigned 'Research Proposal Draft' to you.", time: hours(-1), read: false, type: "task" },
  { id: "n2", title: "Lecturer replied", body: "Dr. Patel commented on 'Research Proposal Draft'.", time: hours(-3), read: false, type: "comment" },
  { id: "n3", title: "Deadline approaching", body: "'Methodology Section' is due in 6 hours.", time: hours(-2), read: true, type: "deadline" },
  { id: "n4", title: "Submission graded", body: "'Data Analysis Report' received a grade.", time: hours(-12), read: true, type: "grade" },
];

export const mockUnits = [
  { id: "cs601", name: "CS 601 — Advanced Research Methods" },
  { id: "eng520", name: "ENG 520 — Academic Writing" },
  { id: "stat430", name: "STAT 430 — Statistical Analysis" },
  { id: "cs550", name: "CS 550 — Machine Learning" },
];

export const mockGroups = [
  { id: "g1", name: "Team Alpha", members: ["u1", "u2"] },
  { id: "g2", name: "Team Beta", members: ["u3", "u4"] },
  { id: "g3", name: "Team Gamma", members: ["u1", "u5"] },
];
