import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="employee-list">
      <app-data-table
        title="Employee Management"
        subtitle="Manage employee profiles, roles, and organizational structure"
        [columns]="columns"
        [data]="employees"
        [actions]="actions"
        [bulkActions]="bulkActions"
        [searchable]="true"
        [sortable]="true"
        [filterable]="true"
        [selectable]="true"
        [exportable]="true"
        [pagination]="true"
        [pageSize]="10"
        [pageSizeOptions]="[5, 10, 25, 50]"
        (actionClick)="onActionClick($event)"
        (bulkAction)="onBulkAction($event)"
        (export)="onExport()"
        (rowClick)="onRowClick($event)">
      </app-data-table>
    </div>
  `,
  styles: [`
    .employee-list {
      padding: var(--space-6);
    }
  `]
})
export class EmployeeListComponent {
  employees: any[] = [
    {
      id: 1,
      empId: 'E001',
      name: 'John Doe',
      email: 'john.doe@clr.com',
      role: 'Employee',
      status: 'Active',
      department: 'IT',
      joinDate: new Date('2023-01-15'),
      phone: '+1-555-0101'
    },
    {
      id: 2,
      empId: 'E002',
      name: 'Jane Smith',
      email: 'jane.smith@clr.com',
      role: 'Manager',
      status: 'Active',
      department: 'HR',
      joinDate: new Date('2022-08-20'),
      phone: '+1-555-0102'
    },
    {
      id: 3,
      empId: 'E003',
      name: 'Amit Patel',
      email: 'amit.patel@clr.com',
      role: 'Employee',
      status: 'On Leave',
      department: 'Operations',
      joinDate: new Date('2023-03-10'),
      phone: '+1-555-0103'
    },
    {
      id: 4,
      empId: 'E004',
      name: 'Priya Sharma',
      email: 'priya.sharma@clr.com',
      role: 'HR',
      status: 'Active',
      department: 'HR',
      joinDate: new Date('2022-11-05'),
      phone: '+1-555-0104'
    },
    {
      id: 5,
      empId: 'E005',
      name: 'Sandeep Kumar',
      email: 'sandeep.kumar@clr.com',
      role: 'Employee',
      status: 'Inactive',
      department: 'Finance',
      joinDate: new Date('2021-12-01'),
      phone: '+1-555-0105'
    },
    {
      id: 6,
      empId: 'E006',
      name: 'Riya Verma',
      email: 'riya.verma@clr.com',
      role: 'Employee',
      status: 'Active',
      department: 'IT',
      joinDate: new Date('2023-06-15'),
      phone: '+1-555-0106'
    },
    {
      id: 7,
      empId: 'E007',
      name: 'Vikram Singh',
      email: 'vikram.singh@clr.com',
      role: 'Manager',
      status: 'Active',
      department: 'Operations',
      joinDate: new Date('2022-04-12'),
      phone: '+1-555-0107'
    },
    {
      id: 8,
      empId: 'E008',
      name: 'Nisha Kaur',
      email: 'nisha.kaur@clr.com',
      role: 'Employee',
      status: 'Active',
      department: 'Sales',
      joinDate: new Date('2023-09-08'),
      phone: '+1-555-0108'
    },
    {
      id: 9,
      empId: 'E009',
      name: 'Rohit Gupta',
      email: 'rohit.gupta@clr.com',
      role: 'Employee',
      status: 'On Leave',
      department: 'IT',
      joinDate: new Date('2023-02-28'),
      phone: '+1-555-0109'
    },
    {
      id: 10,
      empId: 'E010',
      name: 'Neha Jain',
      email: 'neha.jain@clr.com',
      role: 'HR',
      status: 'Active',
      department: 'HR',
      joinDate: new Date('2022-07-18'),
      phone: '+1-555-0110'
    },
  ];

  columns: TableColumn[] = [
    { key: 'empId', label: 'Employee ID', sortable: true, width: '120px' },
    { key: 'name', label: 'Full Name', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, width: '100px' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '100px',
      format: (value: string) => {
        const statusClasses = {
          'Active': 'bg-success',
          'On Leave': 'bg-warning text-dark',
          'Inactive': 'bg-secondary'
        };
        return `<span class="badge ${statusClasses[value as keyof typeof statusClasses] || 'bg-secondary'}">${value}</span>`;
      }
    },
    { key: 'department', label: 'Department', sortable: true, width: '120px' },
    { key: 'joinDate', label: 'Join Date', sortable: true, type: 'date', width: '120px' }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: 'primary' },
    { label: 'View', icon: 'bi-eye', action: 'view', color: 'secondary' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: 'danger' }
  ];

  bulkActions = [
    { label: 'Export Selected', icon: 'bi-download', action: 'export' },
    { label: 'Delete Selected', icon: 'bi-trash', action: 'bulk-delete' }
  ];

  constructor(private router: Router) {}

  onActionClick(event: { action: string; row: any }): void {
    const { action, row } = event;

    switch (action) {
      case 'edit':
        this.router.navigate(['/employee/edit', row.id]);
        break;
      case 'view':
        this.router.navigate(['/employee/view', row.id]);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${row.name}?`)) {
          this.employees = this.employees.filter(emp => emp.id !== row.id);
        }
        break;
    }
  }

  onBulkAction(event: { action: string; rows: any[] }): void {
    const { action, rows } = event;

    switch (action) {
      case 'export':
        this.exportSelected(rows);
        break;
      case 'bulk-delete':
        if (confirm(`Are you sure you want to delete ${rows.length} employees?`)) {
          const ids = rows.map(row => row.id);
          this.employees = this.employees.filter(emp => !ids.includes(emp.id));
        }
        break;
    }
  }

  onRowClick(row: any): void {
    this.router.navigate(['/employee/view', row.id]);
  }

  onExport(): void {
    this.exportToCsv(this.employees);
  }

  private exportSelected(rows: any[]): void {
    this.exportToCsv(rows);
  }

  private exportToCsv(data: any[]): void {
    const headers = ['Employee ID', 'Name', 'Email', 'Role', 'Status', 'Department', 'Join Date', 'Phone'];
    const rows = data.map(emp => [
      emp.empId,
      emp.name,
      emp.email,
      emp.role,
      emp.status,
      emp.department,
      emp.joinDate.toISOString().split('T')[0],
      emp.phone
    ]);

    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${c}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employees-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
