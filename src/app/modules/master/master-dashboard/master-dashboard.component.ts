import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-master-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="master-dashboard">
      <h2>Configuration Hub</h2>
      <p class="text-muted">System-level settings for menus, roles, tenants and access control.</p>

      <div class="row g-3 mt-4">
        <div class="col-md-3">
          <a routerLink="/master/menu" class="config-tile">
            <i class="bi bi-list"></i>
            <div>
              <h5>Menu Management</h5>
              <p>Manage navigation structure and submenu hierarchy.</p>
            </div>
          </a>
        </div>
        <div class="col-md-3">
          <a routerLink="/master/roles" class="config-tile">
            <i class="bi bi-shield-lock"></i>
            <div>
              <h5>Role Management</h5>
              <p>Configure roles and permissions (RBAC).</p>
            </div>
          </a>
        </div>
        <div class="col-md-3">
          <a routerLink="/master/tenants" class="config-tile">
            <i class="bi bi-building"></i>
            <div>
              <h5>Tenant Management</h5>
              <p>Manage tenant accounts and multi-tenant configurations.</p>
            </div>
          </a>
        </div>
        <div class="col-md-3">
          <a routerLink="/master/modules" class="config-tile">
            <i class="bi bi-puzzle-piece"></i>
            <div>
              <h5>Module Management</h5>
              <p>Enable/disable modules per tenant and configure access.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.master-dashboard { padding: 2rem; }
    .config-tile { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: white; border-radius: 0.8rem; border: 1px solid #e5e9f2; text-decoration: none; color: #1f2f5b; box-shadow: 0 6px 16px rgba(31,47,91,0.08); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .config-tile:hover { transform: translateY(-2px); box-shadow: 0 9px 24px rgba(31,47,91,0.16); }
    .config-tile i { font-size: 1.9rem; color: #0d6efd; margin-top: 0.2rem; }
    .config-tile h5 { margin-bottom: 0.25rem; }
    .config-tile p { margin-bottom: 0; color: #6b7280; }
    ` 
  ]
})
export class MasterDashboardComponent {}