import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="config-card">
      <h3>Role Management</h3>
      <p class="text-muted">Define access control and permissions per role.</p>

      <table class="table table-hover mt-4">
        <thead class="table-light">
          <tr>
            <th>Role</th>
            <th>Description</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let role of roles">
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>{{ role.permissions.join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class RoleManagementComponent {
  private configService = inject(ConfigService);
  roles = this.configService.getRoles();
}