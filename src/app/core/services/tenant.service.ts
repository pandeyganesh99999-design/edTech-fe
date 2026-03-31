import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantConfig } from '../models/config.model';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
    // Demo tenants list for login dropdown
    public tenants = [
      { tenantId: 'clr', tenantName: 'CLR BioMetric' },
      { tenantId: 'acme', tenantName: 'Acme Corp' },
      { tenantId: 'demo', tenantName: 'Demo Institute' }
    ];
  private themeService = inject(ThemeService);
  private tenantContextSubject = new BehaviorSubject<TenantConfig | null>(null);
  public tenantContext$ = this.tenantContextSubject.asObservable();

  constructor() {
    this.initializeTenant();
  }

  private initializeTenant(): void {
    const stored = localStorage.getItem('tenantContext');
    if (stored) {
      const tenant = JSON.parse(stored);
      this.setTenantContext(tenant);
      return;
    }

    // Default to CLR tenant for demo
    const defaultTenant: TenantConfig = {
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
    };

    this.setTenantContext(defaultTenant);
  }

  setTenantContext(context: TenantConfig): void {
    this.tenantContextSubject.next(context);

    // Apply tenant theme
    if (context.theme) {
      this.themeService.applyTheme(context.theme);
    }

    // Store in localStorage for persistence
    localStorage.setItem('tenantContext', JSON.stringify(context));
  }

  getTenantContext(): TenantConfig | null {
    return this.tenantContextSubject.value;
  }

  get currentTenant(): TenantConfig | null {
    return this.tenantContextSubject.value;
  }

  getTenantId(): string | null {
    return this.tenantContextSubject.value?.tenantId || null;
  }

  switchTenant(tenantId: string): void {
    // In a real app, this would fetch tenant config from API
    // For demo, we'll use local config
    const mockTenants: TenantConfig[] = [
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
    ];

    const tenant = mockTenants.find(t => t.tenantId === tenantId);
    if (tenant) {
      this.setTenantContext(tenant);
    }
  }

  clearTenantContext(): void {
    this.tenantContextSubject.next(null);
    this.themeService.removeTenantTheme();
    localStorage.removeItem('tenantContext');
  }
}