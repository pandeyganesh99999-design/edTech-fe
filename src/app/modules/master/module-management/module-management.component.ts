import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../core/services/config.service';
import { ModuleConfig } from '../../../core/models/config.model';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-module-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="module-management">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Module Management</h2>
          <p class="text-muted">Configure system modules and their access permissions</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <i class="bi bi-plus-circle"></i> Add Module
        </button>
      </div>

      <app-data-table
        [columns]="columns"
        [data]="modules"
        [actions]="actions"
        [searchable]="true"
        [sortable]="true"
        (actionClick)="onActionClick($event)"
        (rowClick)="onRowClick($event)">
      </app-data-table>

      <!-- Add/Edit Module Modal -->
      <div class="modal fade" [class.show]="showAddModal || editingModule" [style.display]="(showAddModal || editingModule) ? 'block' : 'none'" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingModule ? 'Edit Module' : 'Add New Module' }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form #moduleForm="ngForm">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Module ID</label>
                      <input type="text" class="form-control" [(ngModel)]="currentModule.moduleId" name="moduleId" required [disabled]="!!editingModule">
                      <small class="form-text text-muted">Unique identifier for the module</small>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Display Name</label>
                      <input type="text" class="form-control" [(ngModel)]="currentModule.name" name="name" required>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="currentModule.description" name="description" rows="2"></textarea>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Icon Class</label>
                      <input type="text" class="form-control" [(ngModel)]="currentModule.icon" name="icon" placeholder="bi bi-house-door">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Route Path</label>
                      <input type="text" class="form-control" [(ngModel)]="currentModule.route" name="route" placeholder="/dashboard">
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Order</label>
                  <input type="number" class="form-control" [(ngModel)]="currentModule.order" name="order" min="1">
                </div>

                <div class="mb-3">
                  <label class="form-label">Allowed Roles</label>
                  <div class="role-checkboxes">
                    <div *ngFor="let role of availableRoles" class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        [id]="'role-' + role.roleId"
                        [checked]="isRoleAllowed(role.roleId)"
                        (change)="toggleRole(role.roleId)"
                      >
                      <label class="form-check-label" [for]="'role-' + role.roleId">
                        {{ role.name }}
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" [(ngModel)]="currentModule.isEnabled" name="isEnabled">
                    <label class="form-check-label">Enabled</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveModule()" [disabled]="!moduleForm.valid">
                {{ editingModule ? 'Update' : 'Create' }} Module
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div class="modal-backdrop fade show" *ngIf="showAddModal || editingModule"></div>
    </div>
  `,
  styles: [`
    .module-management {
      padding: var(--space-6);
    }

    .role-checkboxes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--space-2);
      padding: var(--space-3);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
    }

    .modal {
      z-index: 1055;
    }

    .modal-backdrop {
      z-index: 1050;
    }
  `]
})
export class ModuleManagementComponent implements OnInit {
  private configService = inject(ConfigService);

  modules: ModuleConfig[] = [];
  availableRoles: any[] = [];
  showAddModal = false;
  editingModule: ModuleConfig | null = null;

  currentModule: ModuleConfig = this.createEmptyModule();

  columns: TableColumn[] = [
    { key: 'name', label: 'Module Name', sortable: true },
    { key: 'moduleId', label: 'Module ID', sortable: true },
    { key: 'route', label: 'Route', sortable: true },
    {
      key: 'isEnabled',
      label: 'Status',
      sortable: true,
      type: 'boolean',
      format: (value: boolean) => value ? 'Enabled' : 'Disabled'
    },
    { key: 'order', label: 'Order', sortable: true, width: '80px' }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: 'primary' },
    { label: 'Toggle', icon: 'bi-toggle-on', action: 'toggle', color: 'warning' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: 'danger' }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.modules = this.configService.getModules();
    this.availableRoles = this.configService.getRoles();
  }

  onActionClick(event: { action: string; row: any }): void {
    const { action, row } = event;

    switch (action) {
      case 'edit':
        this.editModule(row);
        break;
      case 'toggle':
        this.configService.toggleModule(row.moduleId, !row.isEnabled);
        this.loadData();
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete module "${row.name}"?`)) {
          // Note: In a real app, you'd have a delete method in config service
          this.modules = this.modules.filter(m => m.moduleId !== row.moduleId);
        }
        break;
    }
  }

  onRowClick(row: any): void {
    this.editModule(row);
  }

  editModule(module: ModuleConfig): void {
    this.editingModule = module;
    this.currentModule = { ...module };
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingModule = null;
    this.currentModule = this.createEmptyModule();
  }

  saveModule(): void {
    if (this.editingModule) {
      this.configService.updateModule(this.currentModule);
    } else {
      // Add new module logic would go here
      this.modules.push(this.currentModule);
    }

    this.loadData();
    this.closeModal();
  }

  isRoleAllowed(roleId: string): boolean {
    return this.currentModule.roles.includes(roleId);
  }

  toggleRole(roleId: string): void {
    const index = this.currentModule.roles.indexOf(roleId);
    if (index > -1) {
      this.currentModule.roles.splice(index, 1);
    } else {
      this.currentModule.roles.push(roleId);
    }
  }

  private createEmptyModule(): ModuleConfig {
    return {
      moduleId: '',
      name: '',
      description: '',
      icon: 'bi bi-circle',
      route: '',
      roles: ['admin'],
      isEnabled: true,
      order: 99
    };
  }
}