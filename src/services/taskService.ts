import api from "../lib/api";
import { Task, TaskStatus, TaskSubmission } from "../types/academic";

export const taskService = {
  getTasks: async (unitId: string): Promise<Task[]> => {
    if (!unitId || unitId === "undefined") {
      console.warn("getTasks called without a valid unitId");
      return [];
    }
    const response = await api.get(`tasks/?unit=${unitId}`);
    return response.data;
  },

  createTask: async (task: Omit<Task, "id">): Promise<Task> => {
    const response = await api.post("tasks/", task);
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => {
    // Hits: PATCH /api/tasks/{taskId}/
    // Backend TaskSerializer will intercept this status and update TaskSubmission
    const response = await api.patch(`tasks/${taskId}/`, { status });
    return response.data;
  },

  getSubmissions: async (): Promise<TaskSubmission[]> => {
    // Hits: GET /api/tasks/submissions/
    const response = await api.get("tasks/submissions/");
    return response.data;
  },

  updateSubmissionStatus: async (submissionId: string | number, status: TaskStatus): Promise<TaskSubmission> => {
    // Hits: PATCH /api/tasks/submissions/{submissionId}/
    const response = await api.patch(`tasks/submissions/${submissionId}/`, { status });
    return response.data;
  }
};