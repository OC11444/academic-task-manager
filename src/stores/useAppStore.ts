import {
  School,
  Department,
  Course,
  Unit,
  type Task,
  type TaskStatus,
  type Priority,
  type Notification,
  type NotificationType,
  type AcademicReport,
  type TaskSubmission, //  NEW
} from "../types/academic";
import { academicService } from "../services/academicService";
import { useState, useCallback, useEffect } from "react";
import api from "../lib/api";
import { taskService } from "../services/taskService";
import { socialService } from "../services/socialService";
import { reportService } from "../services/reportService";

import { type TeamMember } from "./mockData";


export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]); // 👈 NEW
  const [isCreating, setIsCreating] = useState(false);

  //  Fetch Submissions for Staff
  const fetchSubmissions = useCallback(async () => {
    try {
      const data = await taskService.getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error(" FRONTEND: Failed to fetch submissions:", error);
    }
  }, []);

  // Fetch Tasks for a specific unit
  const fetchTasks = useCallback(async (unitId: string) => {
    try {
      const data = await taskService.getTasks(unitId);
      
      setTasks((prev) => {
        // The "WhatsApp" Merge Logic:
        return data.map((newTask: Task) => {
          // Find if we already have this task in our memory
          const existingTask = prev.find(t => String(t.id) === String(newTask.id));
          
          return {
            ...newTask,
            // If the incoming task has no comments, keep the ones we already have!
            comments: (newTask.comments && newTask.comments.length > 0) 
              ? newTask.comments 
              : (existingTask?.comments || [])
          };
        });
      });
    } catch (error) {
      console.error("❌ FRONTEND: Network call failed:", error);
    }
  }, []);

  //  Create Task via API
  const createTask = useCallback(async (task: Omit<Task, "id">) => {
    setIsCreating(true);
    try {
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Move Task (Update Status) via API
  // Sarah can now move tasks because our backend Permissions and Serializers are aligned.
  const moveTask = useCallback(async (taskId: string, status: TaskStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  }, []);

  // Move Submission (Update Status for Staff)
  const moveSubmission = useCallback(async (submissionId: string | number, status: TaskStatus) => {
    try {
      const updatedSub = await taskService.updateSubmissionStatus(submissionId, status);
      setSubmissions((prev) =>
        prev.map((s) => (String(s.id) === String(submissionId) ? updatedSub : s))
      );
    } catch (error) {
      console.error("Failed to move submission:", error);
    }
  }, []);


  //  Add a real comment to a task
  // UPDATED: Removed author and avatar parameters. 
  // The backend now identifies the user from the JWT Token.
  const addComment = useCallback(async (taskId: string, content: string, parent?: string) => {
    try {
      const newComment = await socialService.addComment({
        taskId,
        content,
        parent
      });

      // Update the Task in our Global Memory with the new comment
      setTasks((prev) =>
        prev.map((t) =>
          String(t.id) === String(taskId) // 👈 FIXED: String/Number Mismatch!
            ? { ...t, comments: [...(t.comments || []), newComment] }
            : t
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  }, []);

  return { 
    tasks, 
    submissions, 
    fetchTasks, 
    fetchSubmissions, 
    createTask, 
    moveTask, 
    moveSubmission, 
    addComment, 
    isCreating 
  };
}


export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔔 Fetch all notifications for the user
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await socialService.getNotifications();
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a single notification as read in the DB and UI
  const markAsRead = useCallback(async (id: string) => {
    try {
      await socialService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    let unreadIds: string[] = [];
    setNotifications((prev) => {
      unreadIds = prev.filter((n) => !n.read).map((n) => n.id);
      return prev;
    });
    if (unreadIds.length === 0) return;
    try {
      await Promise.all(unreadIds.map((id) => socialService.markAsRead(id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications read:", error);
    }
  }, []);

  const addNotification = useCallback(
    (input: { title: string; message: string; type: NotificationType }) => {
      const item: Notification = {
        id: crypto.randomUUID(),
        title: input.title,
        message: input.message,
        type: input.type,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [item, ...prev]);
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllRead,
    addNotification,
    isLoading,
  };
}



export function useTeamPresence() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        // 📡 Hit the new Django endpoint we just built!
        const response = await api.get("users/presence/");
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch team presence:", error);
      }
    };

    // 1. Fetch immediately when the dashboard loads
    fetchPresence();

    // 2. Start the heartbeat: Check who is online every 30 seconds
    const heartbeat = setInterval(fetchPresence, 30000);

    // 3. Clean up if the user logs out or leaves the dashboard
    return () => clearInterval(heartbeat);
  }, []);

  const onlineMembers = members.filter((m) => m.isOnline);
  return { members, onlineMembers };
}

export function useAcademic() {
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await academicService.getSchools();
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async (schoolId: string) => {
    setIsLoading(true);
    try {
      const data = await academicService.getDepartments(schoolId);
      setDepartments(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async (deptId: string) => {
    setIsLoading(true);
    try {
      const data = await academicService.getCourses(deptId);
      setCourses(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnits = useCallback(async (courseId: string) => {
    setIsLoading(true);
    try {
      const data = await academicService.getUnits(courseId);
      setUnits(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    schools,
    departments,
    courses,
    units,
    isLoading,
    fetchSchools,
    fetchDepartments,
    fetchCourses,
    fetchUnits,
  };
}

export function useReports() {
  const [report, setReport] = useState<AcademicReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnitReport = useCallback(async (unitId: string) => {
    setIsLoading(true);
    try {
      const data = await reportService.getUnitReport(unitId);
      setReport(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { report, fetchUnitReport, isLoading };
}