import api from "../lib/api";
import { AcademicReport } from "../types/academic";

export const reportService = {
  // Fetch the summary for a specific Unit
  getUnitReport: async (unitId: string): Promise<AcademicReport> => {
    // Backend expected path: api/reports/tasks/<id>/summary/ or similar
    // For now, aligning with the pattern:
    const response = await api.get(`reports/dashboard/lecturer/`); 
    return response.data;
  },

  // FIX: Aligning with the GlobalUnitReportView we added to reports/urls.py
  getGlobalReport: async (): Promise<AcademicReport> => {
    const response = await api.get("reports/unit/global/");
    return response.data;
  }
};