import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Attendance,
  AttendanceRecord,
  PunchRecord,
  AttendanceStatus,
  PaginatedResponse
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly endpoint = 'attendance';

  constructor(private apiService: ApiService) {}

  // Attendance Records
  getAttendance(params?: {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Attendance>> {
    const queryParams: any = { ...params };
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<Attendance>(this.endpoint, queryParams);
  }

  getAttendanceById(id: string): Observable<Attendance> {
    return this.apiService.get<Attendance>(`${this.endpoint}/${id}`);
  }

  getEmployeeAttendance(employeeId: string, params?: {
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Attendance>> {
    const queryParams: any = { ...params };
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<Attendance>(`${this.endpoint}/employee/${employeeId}`, queryParams);
  }

  // Punch operations
  punchIn(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/in`, {
      employeeId,
      ...data
    });
  }

  punchOut(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/out`, {
      employeeId,
      ...data
    });
  }

  startBreak(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/break-start`, {
      employeeId,
      ...data
    });
  }

  endBreak(employeeId: string, data?: {
    location?: string;
    notes?: string;
  }): Observable<PunchRecord> {
    return this.apiService.post<PunchRecord>(`${this.endpoint}/punch/break-end`, {
      employeeId,
      ...data
    });
  }

  // Manual entry (Admin/HR only)
  createManualEntry(record: AttendanceRecord): Observable<Attendance> {
    return this.apiService.post<Attendance>(`${this.endpoint}/manual`, {
      ...record,
      date: record.date.toISOString(),
      checkIn: record.checkIn?.toISOString(),
      checkOut: record.checkOut?.toISOString()
    });
  }

  updateAttendance(id: string, updates: Partial<Attendance>): Observable<Attendance> {
    const updateData = { ...updates };
    if (updates.checkIn) updateData.checkIn = updates.checkIn.toISOString() as any;
    if (updates.checkOut) updateData.checkOut = updates.checkOut.toISOString() as any;
    if (updates.breakStart) updateData.breakStart = updates.breakStart.toISOString() as any;
    if (updates.breakEnd) updateData.breakEnd = updates.breakEnd.toISOString() as any;

    return this.apiService.put<Attendance>(`${this.endpoint}/${id}`, updateData);
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

    return this.apiService.put<Attendance[]>(`${this.endpoint}/bulk`, { updates: bulkData });
  }

  // Today's attendance
  getTodayAttendance(): Observable<Attendance[]> {
    return this.apiService.get<Attendance[]>(`${this.endpoint}/today`);
  }

  getEmployeeTodayAttendance(employeeId: string): Observable<Attendance | null> {
    return this.apiService.get<Attendance | null>(`${this.endpoint}/today/${employeeId}`);
  }

  // Punch logs
  getPunchLogs(params?: {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<PunchRecord>> {
    const queryParams: any = { ...params };
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<PunchRecord>(`${this.endpoint}/punches`, queryParams);
  }

  // Statistics and reports
  getAttendanceStats(params?: {
    startDate?: Date;
    endDate?: Date;
    department?: string;
    employeeId?: string;
  }): Observable<any> {
    const queryParams: any = { ...params };
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.get<any>(`${this.endpoint}/stats`, queryParams);
  }

  getMonthlyReport(employeeId: string, year: number, month: number): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/report/${employeeId}/${year}/${month}`);
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
    }>(`${this.endpoint}/live-status`);
  }
}