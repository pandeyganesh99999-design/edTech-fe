import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/api.model';
import {
  Attendance,
  AttendanceRecord,
  PunchRecord,
  AttendanceStatus
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly endpoint = 'attendance';

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

  // Attendance Records
  getAttendance(params?: {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Attendance>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.employeeId) queryParams.employeeId = params.employeeId;
    if (params?.status) queryParams.status = params.status;
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<Attendance>(this.endpoint, page, limit, this.buildHttpParams(queryParams));
  }

  getAttendanceById(id: string): Observable<Attendance> {
    return this.apiService.get<Attendance>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getEmployeeAttendance(employeeId: string, params?: {
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Attendance>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = { ...params };
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();
    delete queryParams.page;
    delete queryParams.limit;

    return this.apiService.getPaginated<Attendance>(`${this.endpoint}/employee/${employeeId}`, page, limit, this.buildHttpParams(queryParams));
  }

  // Punch operations
  punchIn(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/in`, {
      employeeId,
      ...data
    }).pipe(
      map(response => response.data)
    );
  }

  punchOut(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/out`, {
      employeeId,
      ...data
    }).pipe(
      map(response => response.data)
    );
  }

  startBreak(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/break-start`, {
      employeeId,
      ...data
    }).pipe(
      map(response => response.data)
    );
  }

  endBreak(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/break-end`, {
      employeeId,
      ...data
    }).pipe(
      map(response => response.data)
    );
  }

  // Manual entry (Admin/HR only)
  createManualEntry(record: AttendanceRecord): Observable<Attendance> {
    return this.apiService.post<Attendance>(`${this.endpoint}/manual`, {
      ...record,
      date: record.date.toISOString(),
      checkIn: record.checkIn?.toISOString(),
      checkOut: record.checkOut?.toISOString()
    }).pipe(
      map(response => response.data)
    );
  }

  updateAttendance(id: string, updates: Partial<Attendance>): Observable<Attendance> {
    const updateData = { ...updates };
    if (updates.checkIn) updateData.checkIn = updates.checkIn.toISOString() as any;
    if (updates.checkOut) updateData.checkOut = updates.checkOut.toISOString() as any;
    if (updates.breakStart) updateData.breakStart = updates.breakStart.toISOString() as any;
    if (updates.breakEnd) updateData.breakEnd = updates.breakEnd.toISOString() as any;

    return this.apiService.put<Attendance>(`${this.endpoint}/${id}`, updateData).pipe(
      map(response => response.data)
    );
  }

  // Bulk operations
  bulkUpdateAttendance(updates: { id: string; updates: Partial<Attendance> }[]): Observable<Attendance[]> {
    const bulkData = updates.map(item => ({
      id: item.id,
      updates: {
        ...item.updates,
        checkIn: item.updates.checkIn?.toISOString(),
        checkOut: item.updates.checkOut?.toISOString(),
        breakStart: item.updates.breakStart?.toISOString(),
        breakEnd: item.updates.breakEnd?.toISOString()
      }
    }));

    return this.apiService.put<Attendance[]>(`${this.endpoint}/bulk`, { updates: bulkData }).pipe(
      map(response => response.data)
    );
  }

  // Today's attendance
  getTodayAttendance(): Observable<Attendance[]> {
    return this.apiService.get<Attendance[]>(`${this.endpoint}/today`).pipe(
      map(response => response.data)
    );
  }

  getEmployeeTodayAttendance(employeeId: string): Observable<Attendance | null> {
    return this.apiService.get<Attendance | null>(`${this.endpoint}/today/${employeeId}`).pipe(
      map(response => response.data)
    );
  }

  // Punch logs
  getPunchLogs(params?: {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<PunchRecord>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.employeeId) queryParams.employeeId = params.employeeId;
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<PunchRecord>(`${this.endpoint}/punches`, page, limit, this.buildHttpParams(queryParams));
  }

  // Statistics and reports
  getAttendanceStats(params?: {
    startDate?: Date;
    endDate?: Date;
    department?: string;
    employeeId?: string;
  }): Observable<any> {
    const queryParams: any = {};
    if (params?.department) queryParams.department = params.department;
    if (params?.employeeId) queryParams.employeeId = params.employeeId;
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.get<any>(`${this.endpoint}/stats`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  getMonthlyReport(employeeId: string, year: number, month: number): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/report/${employeeId}/${year}/${month}`).pipe(
      map(response => response.data)
    );
  }

  // Real-time status
  getLiveAttendanceStatus(): Observable<{
    totalPresent: number;
    totalEmployees: number;
    lateArrivals: number;
    absentToday: number;
  }> {
    return this.apiService.get<{
      totalPresent: number;
      totalEmployees: number;
      lateArrivals: number;
      absentToday: number;
    }>(`${this.endpoint}/live-status`).pipe(
      map(response => response.data)
    );
  }
}