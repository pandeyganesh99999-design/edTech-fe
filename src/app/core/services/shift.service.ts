import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Shift,
  ShiftAssignment,
  ShiftScheduleRequest,
  PaginatedResponse
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private readonly endpoint = 'shift';

  constructor(private apiService: ApiService) {}

  // Shift Management
  getShifts(params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Shift>> {
    return this.apiService.getPaginated<Shift>(this.endpoint, params);
  }

  getShiftById(id: string): Observable<Shift> {
    return this.apiService.get<Shift>(`${this.endpoint}/${id}`);
  }

  createShift(shift: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>): Observable<Shift> {
    return this.apiService.post<Shift>(this.endpoint, shift);
  }

  updateShift(id: string, shift: Partial<Shift>): Observable<Shift> {
    return this.apiService.put<Shift>(`${this.endpoint}/${id}`, shift);
  }

  deleteShift(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleShift(id: string, isActive: boolean): Observable<Shift> {
    return this.apiService.put<Shift>(`${this.endpoint}/${id}/toggle`, { isActive });
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
    return this.apiService.getPaginated<ShiftAssignment>(`${this.endpoint}/assignments`, params);
  }

  getEmployeeShiftAssignments(employeeId: string): Observable<ShiftAssignment[]> {
    return this.apiService.get<ShiftAssignment[]>(`${this.endpoint}/assignments/employee/${employeeId}`);
  }

  assignShift(request: ShiftScheduleRequest): Observable<ShiftAssignment> {
    return this.apiService.post<ShiftAssignment>(`${this.endpoint}/assignments`, request);
  }

  updateShiftAssignment(id: string, updates: Partial<ShiftAssignment>): Observable<ShiftAssignment> {
    return this.apiService.put<ShiftAssignment>(`${this.endpoint}/assignments/${id}`, updates);
  }

  removeShiftAssignment(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/assignments/${id}`);
  }

  // Bulk operations
  bulkAssignShifts(assignments: ShiftScheduleRequest[]): Observable<ShiftAssignment[]> {
    return this.apiService.post<ShiftAssignment[]>(`${this.endpoint}/assignments/bulk`, { assignments });
  }

  // Schedule methods
  getShiftSchedule(startDate: Date, endDate: Date, employeeId?: string): Observable<any[]> {
    const params: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    if (employeeId) params.employeeId = employeeId;

    return this.apiService.get<any[]>(`${this.endpoint}/schedule`, params);
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
    });
  }

  // Statistics
  getShiftStats(params?: {
    startDate?: Date;
    endDate?: Date;
    department?: string;
  }): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/stats`, params);
  }
}