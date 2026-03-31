import { useState, useCallback } from "react";
import {
  mockTasks,
  mockNotifications,
  mockTeamMembers,
  type Task,
  type Notification,
  type Comment,
  type TeamMember,
  type TaskStatus,
  type Priority,
} from "./mockData";

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isCreating, setIsCreating] = useState(false);

  const createTask = useCallback(
    async (task: Omit<Task, "id" | "createdAt" | "comments">) => {
      setIsCreating(true);
      await delay(800);
      const newTask: Task = {
        ...task,
        id: `t${Date.now()}`,
        createdAt: new Date(),
        comments: [],
      };
      setTasks((prev) => [newTask, ...prev]);
      setIsCreating(false);
      return newTask;
    },
    []
  );

  const moveTask = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  }, []);

  const addComment = useCallback(
    (taskId: string, content: string, author: string, avatar: string) => {
      const optimisticComment: Comment = {
        id: `c${Date.now()}`,
        taskId,
        author,
        avatar,
        content,
        createdAt: new Date(),
        isOptimistic: true,
      };
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, comments: [...t.comments, optimisticComment] }
            : t
        )
      );
      // Simulate server confirmation
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: t.comments.map((c) =>
                    c.id === optimisticComment.id
                      ? { ...c, isOptimistic: false }
                      : c
                  ),
                }
              : t
          )
        );
      }, 600);
    },
    []
  );

  return { tasks, createTask, moveTask, addComment, isCreating };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    setNotifications((prev) => [
      { ...notification, id: `n${Date.now()}` },
      ...prev,
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAsRead, markAllRead, addNotification };
}

export function useTeamPresence() {
  const [members] = useState<TeamMember[]>(mockTeamMembers);
  const onlineMembers = members.filter((m) => m.isOnline);
  return { members, onlineMembers };
}
