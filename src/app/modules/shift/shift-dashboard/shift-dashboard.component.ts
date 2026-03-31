import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shift-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shift-dashboard">
      <h2>Shift Management</h2>
      <p>Shift module coming soon...</p>
    </div>
  `,
  styles: [`
    .shift-dashboard {
      padding: 2rem;
    }
  `]
})
export class ShiftDashboardComponent {}