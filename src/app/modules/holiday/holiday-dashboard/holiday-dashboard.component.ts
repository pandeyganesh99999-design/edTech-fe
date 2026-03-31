import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-holiday-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="holiday-dashboard">
      <h2>Holiday Management</h2>
      <p>Holiday module coming soon...</p>
    </div>
  `,
  styles: [`
    .holiday-dashboard {
      padding: 2rem;
    }
  `]
})
export class HolidayDashboardComponent {}