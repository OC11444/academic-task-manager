import api from "../lib/api";
import { School, Department, Course, Unit } from "../types/academic";

export const academicService = {
  // All paths now prefixed with 'academic/' to match the backend module
  getSchools: async (): Promise<School[]> => {
    const response = await api.get("academic/schools/"); 
    return response.data;
  },

  getDepartments: async (schoolId: string): Promise<Department[]> => {
    const response = await api.get(`academic/departments/?school=${schoolId}`);
    return response.data;
  },

  getCourses: async (deptId: string): Promise<Course[]> => {
    const response = await api.get(`academic/courses/?department=${deptId}`);
    return response.data;
  },

  getUnits: async (courseId: string): Promise<Unit[]> => {
    const response = await api.get(`academic/units/?course=${courseId}`);
    return response.data;
  }
};

