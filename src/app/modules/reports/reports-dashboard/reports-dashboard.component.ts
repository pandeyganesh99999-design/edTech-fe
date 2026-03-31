import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-dashboard">
      <h2>Reports</h2>
      <p>Reports module coming soon...</p>
    </div>
  `,
  styles: [`
    .reports-dashboard {
      padding: 2rem;
    }
  `]
})
export class ReportsDashboardComponent {}