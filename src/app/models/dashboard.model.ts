/**
 * Dashboard Module Models
 */

export interface DashboardCount {
  value: number;
}

export interface ChartData {
  date: string;
  date_formatted: string;
  total_expense: number;
  total_revenue: number;
}

export interface DashboardResponse {
  empcount: DashboardCount[];
  expcount: DashboardCount[];
  fiscount: DashboardCount[];
  lblcount: DashboardCount[];
  revcount: DashboardCount[];
  usrcount: DashboardCount[];
  chartData?: ChartData[];
}
