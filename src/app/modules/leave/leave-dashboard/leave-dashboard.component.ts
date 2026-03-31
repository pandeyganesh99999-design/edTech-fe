import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leave-dashboard">
      <h2>Leave Management</h2>
      <p>Leave module coming soon...</p>
    </div>
  `,
  styles: [`
    .leave-dashboard {
      padding: 2rem;
    }
  `]
})
export class LeaveDashboardComponent {}