import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';
import { NavItem } from '../../../core/models/config.model';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="config-card">
      <h3>Menu & Submenu Management</h3>
      <p class="text-muted">Edit navigation structure and access roles.</p>

      <div class="mt-4">
        <table class="table table-bordered table-striped align-middle">
          <thead class="table-light">
            <tr>
              <th>Label</th>
              <th>Route</th>
              <th>Icon</th>
              <th>Roles</th>
              <th>Children</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of navItems">
              <td>{{ item.label }}</td>
              <td>{{ item.route || '-' }}</td>
              <td>{{ item.icon }}</td>
              <td><span class="badge bg-secondary me-1" *ngFor="let r of item.roles">{{ r }}</span></td>
              <td>{{ item.children?.length || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <small class="text-muted">Tip: to change ordering and structure, configure in ConfigService or backend API.</small>
    </div>
  `,
  styles: [`
    .config-card { padding: 1rem; background: white; border-radius: 0.8rem; box-shadow: 0 6px 26px rgba(0,0,0,0.06); }
  `]
})
export class MenuManagementComponent {
  private configService = inject(ConfigService);
  navItems: NavItem[] = this.configService.getNavItems();
}