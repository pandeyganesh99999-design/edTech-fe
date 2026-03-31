import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/auth.model';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
    loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.HR] }
  },
  {
    path: 'attendance',
    loadChildren: () => import('./modules/attendance/attendance.module').then(m => m.AttendanceModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'leave',
    loadChildren: () => import('./modules/leave/leave.module').then(m => m.LeaveModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shift',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.HR] },
    children: [
      { path: '', loadComponent: () => import('./modules/shift/shift-dashboard/shift-dashboard.component').then(m => m.ShiftDashboardComponent) }
    ]
  },
  {
    path: 'holiday',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: '', loadComponent: () => import('./modules/holiday/holiday-dashboard/holiday-dashboard.component').then(m => m.HolidayDashboardComponent) }
    ]
  },
  {
    path: 'master',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: '', loadComponent: () => import('./modules/master/master-dashboard/master-dashboard.component').then(m => m.MasterDashboardComponent) },
      { path: 'menu', loadComponent: () => import('./modules/master/menu-management/menu-management.component').then(m => m.MenuManagementComponent) },
      { path: 'roles', loadComponent: () => import('./modules/master/role-management/role-management.component').then(m => m.RoleManagementComponent) },
      { path: 'tenants', loadComponent: () => import('./modules/master/tenant-management/tenant-management.component').then(m => m.TenantManagementComponent) },
      { path: 'modules', loadComponent: () => import('./modules/master/module-management/module-management.component').then(m => m.ModuleManagementComponent) }
    ]
  },
  {
    path: 'reports',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.HR] },
    children: [
      { path: '', loadComponent: () => import('./modules/reports/reports-dashboard/reports-dashboard.component').then(m => m.ReportsDashboardComponent) }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
