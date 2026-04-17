import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Expense } from './expense/expense';
import { Revenue } from './revenue/revenue';
import { EmployeeMaster } from './employee-master/employee-master';
import { FishMaster } from './fish-master/fish-master';
import { Layout } from './layout/layout';
import { ExpenseLabelMaster } from './expense-label-master/expense-label-master';
import { Userreport } from './userreport/userreport';
import { Profit } from './profit/profit';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Redirect root to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login route
  { path: 'login', component: Login },

  // Layout wrapper with sidebar (after login)
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'expense', component: Expense },
      { path: 'revenue', component: Revenue },
      { path: 'employee', component: EmployeeMaster },
      { path: 'fishitem', component: FishMaster },
      { path: 'expenselabel', component: ExpenseLabelMaster },
      { path: 'userreport', component: Userreport, canActivate: [AdminGuard] },
      { path: 'profitreport', component: Profit },
    ],
  },

  // Catch-all route
  { path: '**', redirectTo: 'login' },
];
