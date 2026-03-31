import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavItem, RoleConfig, TenantConfig, ModuleConfig, ThemeConfig } from '../models/config.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private navItems$ = new BehaviorSubject<NavItem[]>([
    { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/dashboard', roles: ['admin','hr','manager','employee'], enabled: true },
    { id: 'today', label: "Today's Summary", icon: 'bi bi-calendar-day', route: '/today', roles: ['admin','hr','manager'], enabled: true },
    {
      id: 'employee', label: 'Employees', icon: 'bi bi-people', roles: ['admin','hr'], enabled: true, children: [
        { id: 'empmaster', label: 'Employee Master', icon: 'bi bi-person-workspace', route: '/employee/list', roles: ['admin','hr'], enabled: true },
        { id: 'offboarding', label: 'Employee Offboarding', icon: 'bi bi-box-arrow-right', route: '/employee/offboarding', roles: ['admin','hr'], enabled: true }
      ]
    },
    {
      id: 'attendance', label: 'Attendance', icon: 'bi bi-calendar-check', roles: ['admin','hr','manager','employee'], enabled: true, children: [
        { id: 'daily', label: 'Daily Attendance', icon: 'bi bi-calendar-week', route: '/attendance', roles: ['admin','hr','manager','employee'], enabled: true },
        { id: 'manual', label: 'Manual Entry', icon: 'bi bi-pencil-square', route: '/attendance/manual', roles: ['admin','hr'], enabled: true },
        { id: 'punches', label: 'Punch Logs', icon: 'bi bi-clock', route: '/attendance/punches', roles: ['admin','hr'], enabled: true }
      ]
    },
    {
      id: 'leave', label: 'Leave Management', icon: 'bi bi-calendar-x', roles: ['admin','hr','manager','employee'], enabled: true, children: [
        { id: 'requests', label: 'Leave Requests', icon: 'bi bi-calendar-plus', route: '/leave/requests', roles: ['admin','hr','manager','employee'], enabled: true },
        { id: 'calendar', label: 'Leave Calendar', icon: 'bi bi-calendar', route: '/leave/calendar', roles: ['admin','hr','manager'], enabled: true }
      ]
    },
    {
      id: 'shift', label: 'Shift Management', icon: 'bi bi-clock-history', roles: ['admin','hr'], enabled: true, children: [
        { id: 'schedules', label: 'Shift Schedules', icon: 'bi bi-calendar-range', route: '/shift/schedules', roles: ['admin','hr'], enabled: true },
        { id: 'assignments', label: 'Shift Assignments', icon: 'bi bi-person-check', route: '/shift/assignments', roles: ['admin','hr'], enabled: true }
      ]
    },
    {
      id: 'holiday', label: 'Holiday Management', icon: 'bi bi-calendar-event', roles: ['admin','hr'], enabled: true, children: [
        { id: 'calendar', label: 'Holiday Calendar', icon: 'bi bi-calendar-heart', route: '/holiday/calendar', roles: ['admin','hr'], enabled: true },
        { id: 'settings', label: 'Holiday Settings', icon: 'bi bi-gear', route: '/holiday/settings', roles: ['admin'], enabled: true }
      ]
    },
    {
      id: 'reports', label: 'Reports', icon: 'bi bi-graph-up', roles: ['admin','hr','manager'], enabled: true, children: [
        { id: 'attendance', label: 'Attendance Reports', icon: 'bi bi-file-earmark-bar-graph', route: '/reports/attendance', roles: ['admin','hr','manager'], enabled: true },
        { id: 'leave', label: 'Leave Reports', icon: 'bi bi-file-earmark-text', route: '/reports/leave', roles: ['admin','hr'], enabled: true },
        { id: 'productivity', label: 'Productivity Reports', icon: 'bi bi-bar-chart-line', route: '/reports/productivity', roles: ['admin','hr'], enabled: true }
      ]
    },
    {
      id: 'configuration', label: 'Configuration', icon: 'bi bi-gear', roles: ['admin'], enabled: true, children: [
        { id: 'menu', label: 'Menu Management', icon: 'bi bi-list', route: '/master/menu', roles: ['admin'], enabled: true },
        { id: 'roles', label: 'Role Management', icon: 'bi bi-shield-lock', route: '/master/roles', roles: ['admin'], enabled: true },
        { id: 'tenants', label: 'Tenant Management', icon: 'bi bi-building', route: '/master/tenants', roles: ['admin'], enabled: true },
        { id: 'modules', label: 'Module Management', icon: 'bi bi-puzzle-piece', route: '/master/modules', roles: ['admin'], enabled: true }
      ]
    }
  ]);

  private roles$ = new BehaviorSubject<RoleConfig[]>([
    { roleId: 'admin', name: 'Administrator', description: 'Full system access with all permissions', permissions: ['*'], isActive: true },
    { roleId: 'hr', name: 'Human Resources', description: 'HR related workflows and employee management', permissions: ['employee:read','employee:write','attendance:read','leave:read','leave:write'], isActive: true },
    { roleId: 'manager', name: 'Manager', description: 'Manager level access for team oversight', permissions: ['attendance:read','reports:read','leave:approve'], isActive: true },
    { roleId: 'employee', name: 'Employee', description: 'Basic access for own profile and attendance', permissions: ['profile:read','attendance:read:own','leave:read:own','leave:request'], isActive: true }
  ]);

  private tenants$ = new BehaviorSubject<TenantConfig[]>([
    {
      tenantId: 'clr',
      name: 'CLR BioMetric',
      domain: 'clr.example.com',
      isActive: true,
      theme: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b'
      },
      logo: '/assets/logos/clr-logo.png',
      modules: ['dashboard', 'employee', 'attendance', 'leave', 'shift', 'holiday', 'reports'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      tenantId: 'demo',
      name: 'Demo Corporation',
      domain: 'demo.example.com',
      isActive: true,
      theme: {
        primary: '#10b981',
        secondary: '#6b7280',
        accent: '#8b5cf6'
      },
      logo: '/assets/logos/demo-logo.png',
      modules: ['dashboard', 'employee', 'attendance', 'leave', 'reports'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  private modules$ = new BehaviorSubject<ModuleConfig[]>([
    { moduleId: 'dashboard', name: 'Dashboard', description: 'Main dashboard with key metrics', icon: 'bi-speedometer2', route: '/dashboard', roles: ['admin','hr','manager','employee'], isEnabled: true, order: 1 },
    { moduleId: 'employee', name: 'Employee Management', description: 'Manage employee profiles and data', icon: 'bi-people', route: '/employee', roles: ['admin','hr'], isEnabled: true, order: 2 },
    { moduleId: 'attendance', name: 'Attendance', description: 'Track and manage attendance records', icon: 'bi-calendar-check', route: '/attendance', roles: ['admin','hr','manager','employee'], isEnabled: true, order: 3 },
    { moduleId: 'leave', name: 'Leave Management', description: 'Handle leave requests and approvals', icon: 'bi-calendar-x', route: '/leave', roles: ['admin','hr','manager','employee'], isEnabled: true, order: 4 },
    { moduleId: 'shift', name: 'Shift Management', description: 'Manage work shifts and schedules', icon: 'bi-clock-history', route: '/shift', roles: ['admin','hr'], isEnabled: true, order: 5 },
    { moduleId: 'holiday', name: 'Holiday Management', description: 'Configure holidays and calendar', icon: 'bi-calendar-event', route: '/holiday', roles: ['admin','hr'], isEnabled: true, order: 6 },
    { moduleId: 'reports', name: 'Reports', description: 'Generate and view various reports', icon: 'bi-graph-up', route: '/reports', roles: ['admin','hr','manager'], isEnabled: true, order: 7 }
  ]);

  // Observables
  get navItems() { return this.navItems$.asObservable(); }
  get roles() { return this.roles$.asObservable(); }
  get tenants() { return this.tenants$.asObservable(); }
  get modules() { return this.modules$.asObservable(); }

  // Getters
  getNavItems(): NavItem[] { return this.navItems$.value; }
  getRoles(): RoleConfig[] { return this.roles$.value; }
  getTenants(): TenantConfig[] { return this.tenants$.value; }
  getModules(): ModuleConfig[] { return this.modules$.value; }

  // Filtered getters based on user role and tenant
  getFilteredNavItems(userRole: string, tenantId?: string): NavItem[] {
    const tenant = tenantId ? this.tenants$.value.find(t => t.tenantId === tenantId) : null;
    const enabledModules = tenant?.modules || [];

    return this.filterNavItemsByRoleAndModules(this.navItems$.value, userRole, enabledModules);
  }

  private filterNavItemsByRoleAndModules(items: NavItem[], userRole: string, enabledModules: string[]): NavItem[] {
    return items
      .filter(item => item.enabled !== false && enabledModules.includes(item.id))
      .filter(item => item.roles.includes(userRole) || item.roles.includes('*'))
      .map(item => ({
        ...item,
        children: item.children ? this.filterNavItemsByRoleAndModules(item.children, userRole, enabledModules) : undefined
      }))
      .filter(item => !item.children || item.children.length > 0);
  }

  // CRUD operations
  addRole(role: RoleConfig): void {
    const current = this.roles$.value;
    this.roles$.next([...current, { ...role, isActive: true }]);
  }

  updateRole(role: RoleConfig): void {
    const current = this.roles$.value;
    this.roles$.next(current.map(r => r.roleId === role.roleId ? role : r));
  }

  deleteRole(roleId: string): void {
    const current = this.roles$.value;
    this.roles$.next(current.filter(r => r.roleId !== roleId));
  }

  addTenant(tenant: TenantConfig): void {
    const current = this.tenants$.value;
    this.tenants$.next([...current, { ...tenant, isActive: true, createdAt: new Date(), updatedAt: new Date() }]);
  }

  updateTenant(tenant: TenantConfig): void {
    const current = this.tenants$.value;
    this.tenants$.next(current.map(t => t.tenantId === tenant.tenantId ? { ...tenant, updatedAt: new Date() } : t));
  }

  deleteTenant(tenantId: string): void {
    const current = this.tenants$.value;
    this.tenants$.next(current.filter(t => t.tenantId !== tenantId));
  }

  updateModule(module: ModuleConfig): void {
    const current = this.modules$.value;
    this.modules$.next(current.map(m => m.moduleId === module.moduleId ? module : m));
  }

  toggleModule(moduleId: string, enabled: boolean): void {
    const current = this.modules$.value;
    this.modules$.next(current.map(m => m.moduleId === moduleId ? { ...m, isEnabled: enabled } : m));
  }

  // Navigation management
  updateNavItem(item: NavItem): void {
    const updateItems = (items: NavItem[]): NavItem[] => {
      return items.map(i => i.id === item.id ? item : { ...i, children: i.children ? updateItems(i.children) : undefined });
    };
    this.navItems$.next(updateItems(this.navItems$.value));
  }

  toggleNavItem(itemId: string, enabled: boolean): void {
    const updateItems = (items: NavItem[]): NavItem[] => {
      return items.map(i => i.id === itemId ? { ...i, enabled } : { ...i, children: i.children ? updateItems(i.children) : undefined });
    };
    this.navItems$.next(updateItems(this.navItems$.value));
  }
}
