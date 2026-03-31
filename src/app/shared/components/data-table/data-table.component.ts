import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'action';
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  condition?: (row: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-container">
      <!-- Table Header -->
      <div class="table-header" *ngIf="showHeader">
        <div class="table-title-section">
          <h3 class="table-title" *ngIf="title">{{ title }}</h3>
          <p class="table-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>

        <div class="table-actions">
          <div class="table-search" *ngIf="searchable">
            <div class="search-input-wrapper">
              <i class="bi bi-search search-icon"></i>
              <input
                type="text"
                class="search-input"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                placeholder="Search..."
              />
            </div>
          </div>

          <div class="table-buttons">
            <button
              *ngFor="let action of bulkActions"
              class="btn btn-outline-primary btn-sm"
              [disabled]="selectedRows.length === 0"
              (click)="onBulkAction(action.action)"
            >
              <i [class]="action.icon"></i>
              {{ action.label }}
            </button>

            <button
              *ngIf="exportable"
              class="btn btn-outline-secondary btn-sm"
              (click)="onExport()"
            >
              <i class="bi bi-download"></i>
              Export
            </button>

            <button
              *ngIf="refreshable"
              class="btn btn-outline-secondary btn-sm"
              (click)="onRefresh()"
            >
              <i class="bi bi-arrow-clockwise"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper" [class.loading]="loading">
        <table class="data-table">
          <!-- Table Header -->
          <thead class="table-head">
            <tr class="table-row">
              <th class="table-cell checkbox-cell" *ngIf="selectable">
                <input
                  type="checkbox"
                  class="form-check-input"
                  [checked]="isAllSelected()"
                  (change)="onSelectAll($event)"
                />
              </th>

              <th
                *ngFor="let column of columns"
                class="table-cell"
                [class.sortable]="column.sortable"
                [style.width]="column.width"
                [style.text-align]="column.align"
                (click)="column.sortable && onSort(column.key)"
              >
                <div class="cell-content">
                  <span class="cell-label">{{ column.label }}</span>
                  <div class="sort-indicators" *ngIf="column.sortable">
                    <i class="bi bi-chevron-up sort-icon" [class.active]="sortField === column.key && sortDirection === 'asc'"></i>
                    <i class="bi bi-chevron-down sort-icon" [class.active]="sortField === column.key && sortDirection === 'desc'"></i>
                  </div>
                </div>

                <!-- Column Filter -->
                <div class="column-filter" *ngIf="column.filterable && showFilters">
                  <input
                    type="text"
                    class="filter-input"
                    [placeholder]="'Filter ' + column.label"
                    [(ngModel)]="filters[column.key]"
                    (input)="onFilterChange()"
                  />
                </div>
              </th>

              <th class="table-cell actions-cell" *ngIf="actions.length > 0">
                Actions
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="table-body">
            <tr
              *ngFor="let row of paginatedData; let i = index"
              class="table-row"
              [class.selected]="isSelected(row)"
              (click)="onRowClick(row)"
            >
              <td class="table-cell checkbox-cell" *ngIf="selectable">
                <input
                  type="checkbox"
                  class="form-check-input"
                  [checked]="isSelected(row)"
                  (change)="onRowSelect($event, row)"
                  (click)="$event.stopPropagation()"
                />
              </td>

              <td
                *ngFor="let column of columns"
                class="table-cell"
                [style.text-align]="column.align"
              >
                <ng-container [ngSwitch]="column.type">
                  <span *ngSwitchCase="'boolean'">
                    <i class="bi" [class]="getBooleanIcon(row[column.key])"></i>
                  </span>

                  <span *ngSwitchCase="'date'" [title]="row[column.key] | date:'medium'">
                    {{ row[column.key] | date:'short' }}
                  </span>

                  <span *ngSwitchCase="'action'">
                    <button
                      class="btn btn-sm"
                      [class]="'btn-' + (getActionColor(row[column.key]) || 'primary')"
                      (click)="onActionClick(row[column.key], row); $event.stopPropagation()"
                    >
                      {{ getActionLabel(row[column.key]) }}
                    </button>
                  </span>

                  <span *ngSwitchDefault>
                    {{ column.format ? column.format(row[column.key]) : row[column.key] }}
                  </span>
                </ng-container>
              </td>

              <td class="table-cell actions-cell" *ngIf="actions.length > 0">
                <div class="action-buttons">
                  <button
                    *ngFor="let action of actions"
                    class="btn btn-sm action-btn"
                    [class]="'btn-outline-' + (action.color || 'primary')"
                    [disabled]="action.condition && !action.condition(row)"
                    (click)="onActionClick(action.action, row); $event.stopPropagation()"
                    [title]="action.label"
                  >
                    <i [class]="action.icon"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr *ngIf="paginatedData.length === 0" class="empty-row">
              <td [attr.colspan]="getColSpan()" class="empty-cell">
                <div class="empty-state">
                  <i class="bi bi-inbox empty-icon"></i>
                  <h4>No data found</h4>
                  <p *ngIf="searchTerm || hasActiveFilters()">Try adjusting your search or filters.</p>
                  <p *ngIf="!searchTerm && !hasActiveFilters()">{{ emptyMessage }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Loading Overlay -->
        <div class="loading-overlay" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Table Footer -->
      <div class="table-footer" *ngIf="showFooter">
        <!-- Pagination -->
        <div class="pagination-section" *ngIf="pagination">
          <div class="pagination-info">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to
            {{ Math.min(currentPage * pageSize, totalItems) }} of
            {{ totalItems }} entries
          </div>

          <nav aria-label="Table pagination">
            <ul class="pagination pagination-sm">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>

              <li
                *ngFor="let page of getVisiblePages()"
                class="page-item"
                [class.active]="page === currentPage"
              >
                <button class="page-link" (click)="goToPage(page)">
                  {{ page }}
                </button>
              </li>

              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>

          <div class="page-size-selector" *ngIf="pageSizeOptions.length > 1">
            <select
              class="form-select form-select-sm"
              [(ngModel)]="pageSize"
              (change)="onPageSizeChange()"
            >
              <option *ngFor="let size of pageSizeOptions" [value]="size">
                {{ size }} per page
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-table-container {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    /* Table Header */
    .table-header {
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-light);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-4);
    }

    .table-title-section {
      flex: 1;
    }

    .table-title {
      margin: 0 0 var(--space-1) 0;
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
    }

    .table-subtitle {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    .table-actions {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .table-search {
      position: relative;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: var(--space-3);
      color: var(--text-muted);
      font-size: 0.9rem;
      z-index: 1;
    }

    .search-input {
      padding: var(--space-2) var(--space-3) var(--space-2) calc(var(--space-8) + var(--space-1));
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--text-sm);
      width: 250px;
      transition: all var(--transition-fast);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .table-buttons {
      display: flex;
      gap: var(--space-2);
    }

    /* Table */
    .table-wrapper {
      position: relative;
      overflow-x: auto;
    }

    .table-wrapper.loading {
      opacity: 0.6;
      pointer-events: none;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm);
    }

    .table-head {
      background: var(--bg-tertiary);
    }

    .table-row {
      border-bottom: 1px solid var(--border-light);
      transition: background-color var(--transition-fast);
    }

    .table-row:hover {
      background: var(--bg-tertiary);
    }

    .table-row.selected {
      background: var(--color-primary-50);
    }

    .table-cell {
      padding: var(--space-4);
      vertical-align: middle;
      color: var(--text-primary);
    }

    .checkbox-cell {
      width: 40px;
      text-align: center;
    }

    .actions-cell {
      width: 120px;
      text-align: center;
    }

    .sortable {
      cursor: pointer;
      user-select: none;
    }

    .sortable:hover {
      background: var(--bg-secondary);
    }

    .cell-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .cell-label {
      font-weight: var(--font-medium);
    }

    .sort-indicators {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .sort-icon {
      font-size: 0.6rem;
      color: var(--text-muted);
      line-height: 1;
    }

    .sort-icon.active {
      color: var(--color-primary-600);
    }

    .column-filter {
      margin-top: var(--space-2);
    }

    .filter-input {
      width: 100%;
      padding: var(--space-1) var(--space-2);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-1);
      justify-content: center;
    }

    .action-btn {
      padding: var(--space-1) var(--space-2);
      font-size: 0.75rem;
    }

    /* Empty State */
    .empty-row {
      background: var(--bg-primary);
    }

    .empty-cell {
      text-align: center;
      padding: var(--space-12);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--text-muted);
      opacity: 0.5;
    }

    .empty-state h4 {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--text-lg);
    }

    .empty-state p {
      margin: 0;
      color: var(--text-muted);
      font-size: var(--text-sm);
    }

    /* Loading */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10;
    }

    /* Table Footer */
    .table-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--border-light);
      background: var(--bg-tertiary);
    }

    .pagination-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .pagination-info {
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    .pagination {
      margin: 0;
    }

    .page-link {
      color: var(--text-secondary);
      border-color: var(--border-light);
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      margin: 0 var(--space-1);
      transition: all var(--transition-fast);
    }

    .page-link:hover {
      color: var(--color-primary-600);
      border-color: var(--color-primary-300);
      background: var(--color-primary-50);
    }

    .page-item.active .page-link {
      background: var(--color-primary-500);
      border-color: var(--color-primary-500);
      color: white;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .form-select {
      border-color: var(--border-light);
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-select:focus {
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 0.2rem var(--color-primary-100);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-4);
      }

      .table-actions {
        justify-content: space-between;
      }

      .search-input {
        width: 200px;
      }

      .pagination-section {
        flex-direction: column;
        gap: var(--space-3);
        text-align: center;
      }

      .table-cell {
        padding: var(--space-2);
        font-size: 0.75rem;
      }

      .actions-cell {
        width: 100px;
      }
    }

    @media (max-width: 480px) {
      .table-wrapper {
        font-size: 0.75rem;
      }

      .search-input {
        width: 150px;
      }

      .table-buttons {
        flex-wrap: wrap;
      }

      .action-buttons {
        flex-direction: column;
        gap: var(--space-1);
      }
    }
  `]
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() bulkActions: { label: string; icon: string; action: string }[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No records found';

  @Input() searchable = true;
  @Input() sortable = true;
  @Input() filterable = false;
  @Input() selectable = false;
  @Input() exportable = false;
  @Input() refreshable = false;
  @Input() pagination = true;

  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showFilters = false;

  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50, 100];
  @Input() currentPage = 1;

  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();
  @Output() bulkAction = new EventEmitter<{ action: string; rows: any[] }>();
  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<{ field: string; direction: 'asc' | 'desc' }>();
  @Output() filter = new EventEmitter<{ [key: string]: string }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() export = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  searchTerm = '';
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filters: { [key: string]: string } = {};
  selectedRows: any[] = [];
  filteredData: any[] = [];

  get totalItems(): number {
    return this.filteredData.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get paginatedData(): any[] {
    if (!this.pagination) return this.filteredData;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.filteredData = [...this.data];
      this.applyFilters();
      this.currentPage = 1;
    }
  }

  onSearchChange(): void {
    this.applyFilters();
    this.search.emit(this.searchTerm);
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
    this.sort.emit({ field, direction: this.sortDirection });
  }

  onFilterChange(): void {
    this.applyFilters();
    this.filter.emit(this.filters);
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }

  onBulkAction(action: string): void {
    this.bulkAction.emit({ action, rows: this.selectedRows });
  }

  onRowSelect(event: any, row: any): void {
    if (event.target.checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(r => r !== row);
    }
  }

  onSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedRows = [...this.paginatedData];
    } else {
      this.selectedRows = [];
    }
  }

  isSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  isAllSelected(): boolean {
    return this.paginatedData.length > 0 && this.selectedRows.length === this.paginatedData.length;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.pageSizeChange.emit(this.pageSize);
  }

  onExport(): void {
    this.export.emit();
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  private applyFilters(): void {
    let filtered = [...this.data];

    // Apply search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        this.columns.some(col =>
          String(row[col.key] || '').toLowerCase().includes(term)
        )
      );
    }

    // Apply column filters
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key] || '').toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    this.filteredData = filtered;
    this.applySorting();
  }

  private applySorting(): void {
    if (!this.sortField) return;

    this.filteredData.sort((a, b) => {
      const aVal = a[this.sortField];
      const bVal = b[this.sortField];

      let result = 0;
      if (aVal < bVal) result = -1;
      if (aVal > bVal) result = 1;

      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  private hasActiveFilters(): boolean {
    return Object.values(this.filters).some(v => v);
  }

  private getColSpan(): number {
    let span = this.columns.length;
    if (this.selectable) span++;
    if (this.actions.length > 0) span++;
    return span;
  }

  private getBooleanIcon(value: boolean): string {
    return value ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-muted';
  }

  private getActionColor(action: string): string {
    const actionColors: { [key: string]: string } = {
      'edit': 'primary',
      'delete': 'danger',
      'view': 'info',
      'approve': 'success',
      'reject': 'warning'
    };
    return actionColors[action] || 'primary';
  }

  private getActionLabel(action: string): string {
    const actionLabels: { [key: string]: string } = {
      'edit': 'Edit',
      'delete': 'Delete',
      'view': 'View',
      'approve': 'Approve',
      'reject': 'Reject'
    };
    return actionLabels[action] || action;
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}