import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Holiday,
  HolidayType,
  PaginatedResponse
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private readonly endpoint = 'holiday';

  constructor(private apiService: ApiService) {}

  // Holiday Management
  getHolidays(params?: {
    year?: number;
    type?: HolidayType;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Holiday>> {
    return this.apiService.getPaginated<Holiday>(this.endpoint, params);
  }

  getHolidayById(id: string): Observable<Holiday> {
    return this.apiService.get<Holiday>(`${this.endpoint}/${id}`);
  }

  createHoliday(holiday: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt'>): Observable<Holiday> {
    return this.apiService.post<Holiday>(this.endpoint, {
      ...holiday,
      date: holiday.date.toISOString()
    });
  }

  updateHoliday(id: string, holiday: Partial<Holiday>): Observable<Holiday> {
    const updateData = { ...holiday };
    if (holiday.date) {
      updateData.date = holiday.date.toISOString() as any;
    }
    return this.apiService.put<Holiday>(`${this.endpoint}/${id}`, updateData);
  }

  deleteHoliday(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleHoliday(id: string, isActive: boolean): Observable<Holiday> {
    return this.apiService.put<Holiday>(`${this.endpoint}/${id}/toggle`, { isActive });
  }

  // Bulk operations
  createBulkHolidays(holidays: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt'>[]): Observable<Holiday[]> {
    const holidaysData = holidays.map(holiday => ({
      ...holiday,
      date: holiday.date.toISOString()
    }));
    return this.apiService.post<Holiday[]>(`${this.endpoint}/bulk`, { holidays: holidaysData });
  }

  // Calendar methods
  getHolidaysForCalendar(year: number): Observable<Holiday[]> {
    return this.apiService.get<Holiday[]>(`${this.endpoint}/calendar/${year}`);
  }

  getUpcomingHolidays(limit: number = 10): Observable<Holiday[]> {
    return this.apiService.get<Holiday[]>(`${this.endpoint}/upcoming`, { limit });
  }

  // Holiday Types
  getHolidayTypes(): Observable<HolidayType[]> {
    return this.apiService.get<HolidayType[]>(`${this.endpoint}/types`);
  }

  // Validation
  checkDateConflicts(date: Date, excludeId?: string): Observable<{
    hasConflict: boolean;
    conflictingHolidays?: Holiday[];
  }> {
    return this.apiService.post<{
      hasConflict: boolean;
      conflictingHolidays?: Holiday[];
    }>(`${this.endpoint}/check-conflicts`, {
      date: date.toISOString(),
      excludeId
    });
  }

  // Import/Export
  importHolidays(file: File): Observable<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post<{
      imported: number;
      skipped: number;
      errors: string[];
    }>(`${this.endpoint}/import`, formData);
  }

  exportHolidays(params?: {
    year?: number;
    type?: HolidayType;
    format?: 'csv' | 'excel';
  }): Observable<Blob> {
    return this.apiService.download(`${this.endpoint}/export`, params);
  }

  // Settings
  getHolidaySettings(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/settings`);
  }

  updateHolidaySettings(settings: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/settings`, settings);
  }

  // Statistics
  getHolidayStats(year?: number): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/stats`, { year });
  }
}