/**
 * Dashboard Module Models
 */

export interface DashboardCount {
  value: number;
}

export interface DashboardResponse {
  empcount: DashboardCount[];
  expcount: DashboardCount[];
  fiscount: DashboardCount[];
  lblcount: DashboardCount[];
  revcount: DashboardCount[];
  usrcount: DashboardCount[];
}
