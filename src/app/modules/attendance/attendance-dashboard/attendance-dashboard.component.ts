import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="attendance-dashboard">
      <h2>Attendance Dashboard</h2>
      <p>Attendance module coming soon...</p>
    </div>
  `,
  styles: [`
    .attendance-dashboard {
      padding: 2rem;
    }
  `]
})
export class AttendanceDashboardComponent {}