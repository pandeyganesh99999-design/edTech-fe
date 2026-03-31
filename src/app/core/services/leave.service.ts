import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  Leave,
  LeaveRequest,
  LeaveType,
  LeaveStatus,
  PaginatedResponse
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly endpoint = 'leave';

  constructor(private apiService: ApiService) {}

  // Leave Types
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.apiService.get<LeaveType[]>(`${this.endpoint}/types`);
  }

  createLeaveType(leaveType: Omit<LeaveType, 'id' | 'createdAt' | 'updatedAt'>): Observable<LeaveType> {
    return this.apiService.post<LeaveType>(`${this.endpoint}/types`, leaveType);
  }

  updateLeaveType(id: string, leaveType: Partial<LeaveType>): Observable<LeaveType> {
    return this.apiService.put<LeaveType>(`${this.endpoint}/types/${id}`, leaveType);
  }

  deleteLeaveType(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/types/${id}`);
  }

  // Leave Requests
  getLeaves(params?: {
    employeeId?: string;
    status?: LeaveStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Leave>> {
    return this.apiService.getPaginated<Leave>(this.endpoint, params);
  }

  getLeaveById(id: string): Observable<Leave> {
    return this.apiService.get<Leave>(`${this.endpoint}/${id}`);
  }

  createLeaveRequest(request: LeaveRequest): Observable<Leave> {
    const formData = new FormData();
    formData.append('employeeId', request.employeeId);
    formData.append('leaveTypeId', request.leaveTypeId);
    formData.append('startDate', request.startDate.toISOString());
    formData.append('endDate', request.endDate.toISOString());
    formData.append('reason', request.reason);

    if (request.attachments) {
      request.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    return this.apiService.post<Leave>(`${this.endpoint}/request`, formData);
  }

  updateLeaveStatus(id: string, status: LeaveStatus, comments?: string): Observable<Leave> {
    return this.apiService.put<Leave>(`${this.endpoint}/${id}/status`, { status, comments });
  }

  cancelLeave(id: string, reason: string): Observable<Leave> {
    return this.apiService.put<Leave>(`${this.endpoint}/${id}/cancel`, { reason });
  }

  // Employee-specific methods
  getEmployeeLeaves(employeeId: string, params?: {
    status?: LeaveStatus;
    year?: number;
  }): Observable<Leave[]> {
    return this.apiService.get<Leave[]>(`${this.endpoint}/employee/${employeeId}`, params);
  }

  getLeaveBalance(employeeId: string): Observable<Record<string, number>> {
    return this.apiService.get<Record<string, number>>(`${this.endpoint}/balance/${employeeId}`);
  }

  // Calendar methods
  getLeavesForCalendar(startDate: Date, endDate: Date): Observable<Leave[]> {
    return this.apiService.get<Leave[]>(`${this.endpoint}/calendar`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  }

  // Statistics
  getLeaveStats(params?: {
    startDate?: Date;
    endDate?: Date;
    department?: string;
  }): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/stats`, params);
  }
}