import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/api.model';
import {
  Leave,
  LeaveRequest,
  LeaveType,
  LeaveStatus
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly endpoint = 'leave';

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

  // Leave Types
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.apiService.get<LeaveType[]>(`${this.endpoint}/types`).pipe(
      map(response => response.data)
    );
  }

  createLeaveType(leaveType: Omit<LeaveType, 'id' | 'createdAt' | 'updatedAt'>): Observable<LeaveType> {
    return this.apiService.post<LeaveType>(`${this.endpoint}/types`, leaveType).pipe(
      map(response => response.data)
    );
  }

  updateLeaveType(id: string, leaveType: Partial<LeaveType>): Observable<LeaveType> {
    return this.apiService.put<LeaveType>(`${this.endpoint}/types/${id}`, leaveType).pipe(
      map(response => response.data)
    );
  }

  deleteLeaveType(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/types/${id}`).pipe(
      map(response => response.data)
    );
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
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.employeeId) queryParams.employeeId = params.employeeId;
    if (params?.status) queryParams.status = params.status;
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.getPaginated<Leave>(this.endpoint, page, limit, this.buildHttpParams(queryParams));
  }

  getLeaveById(id: string): Observable<Leave> {
    return this.apiService.get<Leave>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
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

    return this.apiService.post<Leave>(`${this.endpoint}/request`, formData).pipe(
      map(response => response.data)
    );
  }

  updateLeaveStatus(id: string, status: LeaveStatus, comments?: string): Observable<Leave> {
    return this.apiService.put<Leave>(`${this.endpoint}/${id}/status`, { status, comments }).pipe(
      map(response => response.data)
    );
  }

  cancelLeave(id: string, reason: string): Observable<Leave> {
    return this.apiService.put<Leave>(`${this.endpoint}/${id}/cancel`, { reason }).pipe(
      map(response => response.data)
    );
  }

  // Employee-specific methods
  getEmployeeLeaves(employeeId: string, params?: {
    status?: LeaveStatus;
    year?: number;
  }): Observable<Leave[]> {
    const queryParams: any = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.year) queryParams.year = params.year;
    
    return this.apiService.get<Leave[]>(`${this.endpoint}/employee/${employeeId}`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  getLeaveBalance(employeeId: string): Observable<Record<string, number>> {
    return this.apiService.get<Record<string, number>>(`${this.endpoint}/balance/${employeeId}`).pipe(
      map(response => response.data)
    );
  }

  // Calendar methods
  getLeavesForCalendar(startDate: Date, endDate: Date): Observable<Leave[]> {
    const queryParams = this.buildHttpParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    return this.apiService.get<Leave[]>(`${this.endpoint}/calendar`, queryParams).pipe(
      map(response => response.data)
    );
  }

  // Statistics
  getLeaveStats(params?: {
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