import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/api.model';
import {
  Shift,
  ShiftAssignment,
  ShiftScheduleRequest
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private readonly endpoint = 'shift';

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

  // Shift Management
  getShifts(params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Shift>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;

    return this.apiService.getPaginated<Shift>(this.endpoint, page, limit, this.buildHttpParams(queryParams));
  }

  getShiftById(id: string): Observable<Shift> {
    return this.apiService.get<Shift>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createShift(shift: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>): Observable<Shift> {
    return this.apiService.post<Shift>(this.endpoint, shift).pipe(
      map(response => response.data)
    );
  }

  updateShift(id: string, shift: Partial<Shift>): Observable<Shift> {
    return this.apiService.put<Shift>(`${this.endpoint}/${id}`, shift).pipe(
      map(response => response.data)
    );
  }

  deleteShift(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  toggleShift(id: string, isActive: boolean): Observable<Shift> {
    return this.apiService.put<Shift>(`${this.endpoint}/${id}/toggle`, { isActive }).pipe(
      map(response => response.data)
    );
  }

  // Shift Assignments
  getShiftAssignments(params?: {
    employeeId?: string;
    shiftId?: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<ShiftAssignment>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.employeeId) queryParams.employeeId = params.employeeId;
    if (params?.shiftId) queryParams.shiftId = params.shiftId;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<ShiftAssignment>(`${this.endpoint}/assignments`, page, limit, this.buildHttpParams(queryParams));
  }

  getEmployeeShiftAssignments(employeeId: string): Observable<ShiftAssignment[]> {
    return this.apiService.get<ShiftAssignment[]>(`${this.endpoint}/assignments/employee/${employeeId}`).pipe(
      map(response => response.data)
    );
  }

  assignShift(request: ShiftScheduleRequest): Observable<ShiftAssignment> {
    return this.apiService.post<ShiftAssignment>(`${this.endpoint}/assignments`, request).pipe(
      map(response => response.data)
    );
  }

  updateShiftAssignment(id: string, updates: Partial<ShiftAssignment>): Observable<ShiftAssignment> {
    return this.apiService.put<ShiftAssignment>(`${this.endpoint}/assignments/${id}`, updates).pipe(
      map(response => response.data)
    );
  }

  removeShiftAssignment(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/assignments/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Bulk operations
  bulkAssignShifts(assignments: ShiftScheduleRequest[]): Observable<ShiftAssignment[]> {
    return this.apiService.post<ShiftAssignment[]>(`${this.endpoint}/assignments/bulk`, { assignments }).pipe(
      map(response => response.data)
    );
  }

  // Schedule methods
  getShiftSchedule(startDate: Date, endDate: Date, employeeId?: string): Observable<any[]> {
    const queryParams: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    if (employeeId) queryParams.employeeId = employeeId;

    return this.apiService.get<any[]>(`${this.endpoint}/schedule`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  // Validation
  validateShiftAssignment(employeeId: string, shiftId: string, startDate: Date, endDate?: Date): Observable<{
    isValid: boolean;
    conflicts?: any[];
    warnings?: string[];
  }> {
    return this.apiService.post<{
      isValid: boolean;
      conflicts?: any[];
      warnings?: string[];
    }>(`${this.endpoint}/validate-assignment`, {
      employeeId,
      shiftId,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString()
    }).pipe(
      map(response => response.data)
    );
  }

  // Statistics
  getShiftStats(params?: {
    startDate?: Date;
    endDate?: Date;
    department?: string;
  }): Observable<any> {
    const queryParams: any = {};
    if (params?.department) queryParams.department = params.department;
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.get<any>(`${this.endpoint}/stats`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }
}