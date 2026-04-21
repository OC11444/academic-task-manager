export interface School {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  schoolId: string; // Linking it to the School
  name: string;
}

export interface Course {
  id: string;
  departmentId: string; // Linking it to the Department
  title: string;
  courseCode: string;
}

export interface Unit {
  id: string;
  courseId: string; // Linking it to the Course
  title: string;
  order: number;
}


export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type Priority = "low" | "medium" | "high";

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

/** API + UI notification kinds (dropdown icons use task/comment/deadline/grade). */
export type NotificationType =
  | "task_assigned"
  | "comment_added"
  | "status_change"
  | "task"
  | "comment"
  | "deadline"
  | "grade";

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  unitId: string;      // Linked to our Hierarchy!
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;     // Backend usually sends dates as strings
  assignedTo?: string; // User ID
  comments?: Comment[];
}

export interface TaskSubmission {
  id: string | number;
  task: number;
  student: number;
  student_name?: string; 
  status: TaskStatus;
  submission_link: string;
  grade?: number | null;
  feedback?: string | null;
  submitted_at?: string;
}

export interface AcademicReport {
  // Submission Rate Tile
  submissionRate: number;        // 87
  submissionTrend: number;      // 4.2

  // On-Time Ratio Tile
  onTimeRatio: number;          // 92
  onTimeTrend: number;          // 1.8

  // Pending Reviews Tile
  pendingReviews: number;       // 24
  urgentReviews: number;        // 3

  // Overdue Feedback Tile
  overdueFeedback: number;      // 6
  overdueTrend: number;         // -2
}

// Add to src/types/academic.ts
export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  isOnline: boolean;
}