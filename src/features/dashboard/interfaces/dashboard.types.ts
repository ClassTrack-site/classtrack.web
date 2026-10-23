export interface DashboardStatsResponse {
  school: {
    id: string;
    name: string;
    code: string;
  };
  counts: {
    totalStudents: number;
    totalTeachers: number;
    totalGroups: number;
    totalClassrooms: number;
  };
  today: {
    date: string;
    totalSessions: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    rescheduled: number;
  };
  weeklyAttendanceRate: {
    period: string;
    percentage: number;
    totalRecords: number;
    presents: number;
    absents: number;
    lates: number;
  };
}
