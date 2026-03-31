import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../core/services/config.service';
import { TenantService } from '../../../core/services/tenant.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TenantConfig, ModuleConfig } from '../../../core/models/config.model';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="tenant-management">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Tenant Management</h2>
          <p class="text-muted">Configure multi-tenant settings, themes, and module access</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <i class="bi bi-plus-circle"></i> Add Tenant
        </button>
      </div>

      <app-data-table
        [columns]="columns"
        [data]="tenants"
        [actions]="actions"
        [searchable]="true"
        [sortable]="true"
        [exportable]="true"
        (actionClick)="onActionClick($event)"
        (rowClick)="onRowClick($event)">
      </app-data-table>

      <!-- Add/Edit Tenant Modal -->
      <div class="modal fade" [class.show]="showAddModal || editingTenant" [style.display]="(showAddModal || editingTenant) ? 'block' : 'none'" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingTenant ? 'Edit Tenant' : 'Add New Tenant' }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form #tenantForm="ngForm">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Tenant Name</label>
                      <input type="text" class="form-control" [(ngModel)]="currentTenant.name" name="name" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Domain</label>
                      <input type="text" class="form-control" [(ngModel)]="currentTenant.domain" name="domain" required>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Logo URL</label>
                  <input type="text" class="form-control" [(ngModel)]="currentTenant.logo" name="logo">
                </div>

                <div class="mb-3">
                  <label class="form-label">Theme Configuration</label>
                  <div class="row">
                    <div class="col-md-4">
                      <label class="form-label">Primary Color</label>
                      <input type="color" class="form-control form-control-color" [(ngModel)]="currentTenant.theme.primary" name="primary">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Secondary Color</label>
                      <input type="color" class="form-control form-control-color" [(ngModel)]="currentTenant.theme.secondary" name="secondary">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Accent Color</label>
                      <input type="color" class="form-control form-control-color" [(ngModel)]="currentTenant.theme.accent" name="accent">
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Enabled Modules</label>
                  <div class="module-grid">
                    <div *ngFor="let module of availableModules" class="module-item">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        [id]="'module-' + module.moduleId"
                        [checked]="isModuleEnabled(module.moduleId)"
                        (change)="toggleModule(module.moduleId)"
                      >
                      <label class="form-check-label" [for]="'module-' + module.moduleId">
                        <i [class]="module.icon"></i> {{ module.name }}
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" [(ngModel)]="currentTenant.isActive" name="isActive">
                    <label class="form-check-label">Active</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveTenant()" [disabled]="!tenantForm.valid">
                {{ editingTenant ? 'Update' : 'Create' }} Tenant
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div class="modal-backdrop fade show" *ngIf="showAddModal || editingTenant"></div>
    </div>
  `,
  styles: [`
    .tenant-management {
      padding: var(--space-6);
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-3);
      padding: var(--space-4);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
    }

    .module-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .module-item i {
      color: var(--color-primary-600);
    }

    .modal {
      z-index: 1055;
    }

    .modal-backdrop {
      z-index: 1050;
    }
  `]
})
export class TenantManagementComponent implements OnInit {
  private configService = inject(ConfigService);
  private tenantService = inject(TenantService);
  private themeService = inject(ThemeService);

  tenants: TenantConfig[] = [];
  availableModules: ModuleConfig[] = [];
  showAddModal = false;
  editingTenant: TenantConfig | null = null;

  currentTenant: TenantConfig = this.createEmptyTenant();

  columns: TableColumn[] = [
    { key: 'name', label: 'Tenant Name', sortable: true },
    { key: 'domain', label: 'Domain', sortable: true },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      type: 'boolean',
      format: (value: boolean) => value ? 'Active' : 'Inactive'
    },
    { key: 'createdAt', label: 'Created', sortable: true, type: 'date' },
    { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: 'primary' },
    { label: 'Switch To', icon: 'bi-arrow-right-circle', action: 'switch', color: 'secondary' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: 'danger' }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.tenants = this.configService.getTenants();
    this.availableModules = this.configService.getModules();
  }

  onActionClick(event: { action: string; row: any }): void {
    const { action, row } = event;

    switch (action) {
      case 'edit':
        this.editTenant(row);
        break;
      case 'switch':
        this.tenantService.switchTenant(row.tenantId);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete tenant "${row.name}"?`)) {
          this.configService.deleteTenant(row.tenantId);
          this.loadData();
        }
        break;
    }
  }

  onRowClick(row: any): void {
    this.editTenant(row);
  }

  editTenant(tenant: TenantConfig): void {
    this.editingTenant = tenant;
    this.currentTenant = { ...tenant };
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingTenant = null;
    this.currentTenant = this.createEmptyTenant();
  }

  saveTenant(): void {
    if (this.editingTenant) {
      this.configService.updateTenant(this.currentTenant);
    } else {
      this.currentTenant.tenantId = this.generateTenantId();
      this.configService.addTenant(this.currentTenant);
    }

    this.loadData();
    this.closeModal();
  }

  isModuleEnabled(moduleId: string): boolean {
    return this.currentTenant.modules?.includes(moduleId) || false;
  }

  toggleModule(moduleId: string): void {
    if (!this.currentTenant.modules) {
      this.currentTenant.modules = [];
    }

    const index = this.currentTenant.modules.indexOf(moduleId);
    if (index > -1) {
      this.currentTenant.modules.splice(index, 1);
    } else {
      this.currentTenant.modules.push(moduleId);
    }
  }

  private createEmptyTenant(): TenantConfig {
    return {
      tenantId: '',
      name: '',
      domain: '',
      isActive: true,
      theme: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b'
      },
      modules: ['dashboard'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateTenantId(): string {
    return this.currentTenant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}