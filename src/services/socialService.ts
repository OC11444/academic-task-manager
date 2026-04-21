import api from "../lib/api";
import { Comment, Notification } from "../types/academic";

export const socialService = {
  // 💬 Comments - Now nested under the specific task
  getComments: async (taskId: string): Promise<Comment[]> => {
    // Hits: GET /api/tasks/{taskId}/comments/
    const response = await api.get(`tasks/${taskId}/comments/`);
    return response.data;
  },

  addComment: async (input: { taskId: string; content: string; parent?: string }): Promise<Comment> => {
    // Hits: POST /api/tasks/{taskId}/comments/
    // We only send content and parent; backend handles the author via token
    const { taskId, content, parent } = input;
    const response = await api.post(`tasks/${taskId}/comments/`, { 
      content, 
      parent 
    });
    return response.data;
  },

  // 🔔 Notifications
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get("notifications/");
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`notifications/${notificationId}/`, { read: true });
  }
};