import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/api.model';
import {
  Holiday,
  HolidayType
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private readonly endpoint = 'holiday';

  constructor(private apiService: ApiService) {}

  private buildHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return httpParams;
  }

  // Holiday Management
  getHolidays(params?: {
    year?: number;
    type?: HolidayType;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Holiday>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.year) queryParams.year = params.year;
    if (params?.type) queryParams.type = params.type;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;

    return this.apiService.getPaginated<Holiday>(this.endpoint, page, limit, this.buildHttpParams(queryParams));
  }

  getHolidayById(id: string): Observable<Holiday> {
    return this.apiService.get<Holiday>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createHoliday(holiday: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt'>): Observable<Holiday> {
    return this.apiService.post<Holiday>(this.endpoint, {
      ...holiday,
      date: holiday.date.toISOString()
    }).pipe(
      map(response => response.data)
    );
  }

  updateHoliday(id: string, holiday: Partial<Holiday>): Observable<Holiday> {
    const updateData = { ...holiday };
    if (holiday.date) {
      updateData.date = holiday.date.toISOString() as any;
    }
    return this.apiService.put<Holiday>(`${this.endpoint}/${id}`, updateData).pipe(
      map(response => response.data)
    );
  }

  deleteHoliday(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  toggleHoliday(id: string, isActive: boolean): Observable<Holiday> {
    return this.apiService.put<Holiday>(`${this.endpoint}/${id}/toggle`, { isActive }).pipe(
      map(response => response.data)
    );
  }

  // Bulk operations
  createBulkHolidays(holidays: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt'>[]): Observable<Holiday[]> {
    const holidaysData = holidays.map(holiday => ({
      ...holiday,
      date: holiday.date.toISOString()
    }));
    return this.apiService.post<Holiday[]>(`${this.endpoint}/bulk`, { holidays: holidaysData }).pipe(
      map(response => response.data)
    );
  }

  // Calendar methods
  getHolidaysForCalendar(year: number): Observable<Holiday[]> {
    return this.apiService.get<Holiday[]>(`${this.endpoint}/calendar/${year}`).pipe(
      map(response => response.data)
    );
  }

  getUpcomingHolidays(limit: number = 10): Observable<Holiday[]> {
    return this.apiService.get<Holiday[]>(`${this.endpoint}/upcoming`, this.buildHttpParams({ limit })).pipe(
      map(response => response.data)
    );
  }

  // Holiday Types
  getHolidayTypes(): Observable<HolidayType[]> {
    return this.apiService.get<HolidayType[]>(`${this.endpoint}/types`).pipe(
      map(response => response.data)
    );
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
    }).pipe(
      map(response => response.data)
    );
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
    }>(`${this.endpoint}/import`, formData).pipe(
      map(response => response.data)
    );
  }

  exportHolidays(params?: {
    year?: number;
    type?: HolidayType;
    format?: 'csv' | 'excel';
  }): Observable<Blob> {
    const queryParams: any = {};
    if (params?.year) queryParams.year = params.year;
    if (params?.type) queryParams.type = params.type;
    if (params?.format) queryParams.format = params.format;
    
    return this.apiService.get<Blob>(`${this.endpoint}/export`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  // Settings
  getHolidaySettings(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/settings`).pipe(
      map(response => response.data)
    );
  }

  updateHolidaySettings(settings: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/settings`, settings).pipe(
      map(response => response.data)
    );
  }

  // Statistics
  getHolidayStats(year?: number): Observable<any> {
    const queryParams: any = {};
    if (year) queryParams.year = year;
    
    return this.apiService.get<any>(`${this.endpoint}/stats`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }
}