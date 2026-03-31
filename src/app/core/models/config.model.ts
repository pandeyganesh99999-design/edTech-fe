export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  roles: string[];
  enabled?: boolean;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  logo?: string;
  favicon?: string;
}

export interface TenantConfig {
  tenantId: string;
  name: string;
  domain: string;
  isActive: boolean;
  theme?: ThemeConfig;
  logo?: string;
  modules?: string[]; // enabled modules for this tenant
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleConfig {
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  isActive?: boolean;
}

export interface ModuleConfig {
  moduleId: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  roles: string[];
  isEnabled: boolean;
  order: number;
}
