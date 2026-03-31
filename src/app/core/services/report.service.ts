import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/api.model';
import {
  Report,
  ReportData,
  ReportType,
  ReportParameter
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly endpoint = 'reports';

  constructor(private apiService: ApiService) {}

  private buildHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          const value = params[key];
          if (typeof value === 'boolean') {
            httpParams = httpParams.set(key, value.toString());
          } else {
            httpParams = httpParams.set(key, value);
          }
        }
      });
    }
    return httpParams;
  }

  // Report Templates
  getReports(params?: {
    type?: ReportType;
    isPublic?: boolean;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Report>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.type) queryParams.type = params.type;
    if (params?.isPublic !== undefined) queryParams.isPublic = params.isPublic;

    return this.apiService.getPaginated<Report>(this.endpoint, page, limit, this.buildHttpParams(queryParams));
  }

  getReportById(id: string): Observable<Report> {
    return this.apiService.get<Report>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Observable<Report> {
    return this.apiService.post<Report>(this.endpoint, report).pipe(
      map(response => response.data)
    );
  }

  updateReport(id: string, report: Partial<Report>): Observable<Report> {
    return this.apiService.put<Report>(`${this.endpoint}/${id}`, report).pipe(
      map(response => response.data)
    );
  }

  deleteReport(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Report Generation
  generateReport(reportId: string, parameters: Record<string, any>): Observable<ReportData> {
    return this.apiService.post<ReportData>(`${this.endpoint}/${reportId}/generate`, { parameters }).pipe(
      map(response => response.data)
    );
  }

  generateCustomReport(type: ReportType, parameters: Record<string, any>): Observable<ReportData> {
    return this.apiService.post<ReportData>(`${this.endpoint}/generate/${type}`, { parameters }).pipe(
      map(response => response.data)
    );
  }

  // Predefined Reports
  getAttendanceReport(params: {
    startDate: Date;
    endDate: Date;
    employeeId?: string;
    department?: string;
    status?: string;
  }): Observable<ReportData> {
    const queryParams: any = {
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    };
    if (params.employeeId) queryParams.employeeId = params.employeeId;
    if (params.department) queryParams.department = params.department;
    if (params.status) queryParams.status = params.status;

    return this.apiService.get<ReportData>(`${this.endpoint}/attendance`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  getLeaveReport(params: {
    startDate: Date;
    endDate: Date;
    employeeId?: string;
    department?: string;
    leaveType?: string;
    status?: string;
  }): Observable<ReportData> {
    const queryParams: any = {
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    };
    if (params.employeeId) queryParams.employeeId = params.employeeId;
    if (params.department) queryParams.department = params.department;
    if (params.leaveType) queryParams.leaveType = params.leaveType;
    if (params.status) queryParams.status = params.status;

    return this.apiService.get<ReportData>(`${this.endpoint}/leave`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  getProductivityReport(params: {
    startDate: Date;
    endDate: Date;
    employeeId?: string;
    department?: string;
    metric?: string;
  }): Observable<ReportData> {
    const queryParams: any = {
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    };
    if (params.employeeId) queryParams.employeeId = params.employeeId;
    if (params.department) queryParams.department = params.department;
    if (params.metric) queryParams.metric = params.metric;

    return this.apiService.get<ReportData>(`${this.endpoint}/productivity`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  getPayrollReport(params: {
    month: number;
    year: number;
    employeeId?: string;
    department?: string;
  }): Observable<ReportData> {
    const queryParams = this.buildHttpParams(params);
    return this.apiService.get<ReportData>(`${this.endpoint}/payroll`, queryParams).pipe(
      map(response => response.data)
    );
  }

  // Export functionality
  exportReport(reportId: string, parameters: Record<string, any>, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    const queryParams = this.buildHttpParams({
      ...parameters,
      format
    });
    return this.apiService.get<Blob>(`${this.endpoint}/${reportId}/export`, queryParams).pipe(
      map(response => response.data)
    );
  }

  exportAttendanceReport(params: any, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    const queryParams: any = {
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString(),
      format
    };
    if (params.employeeId) queryParams.employeeId = params.employeeId;
    if (params.department) queryParams.department = params.department;
    if (params.status) queryParams.status = params.status;

    return this.apiService.get<Blob>(`${this.endpoint}/attendance/export`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  exportLeaveReport(params: any, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    const queryParams: any = {
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString(),
      format
    };
    if (params.employeeId) queryParams.employeeId = params.employeeId;
    if (params.department) queryParams.department = params.department;
    if (params.leaveType) queryParams.leaveType = params.leaveType;
    if (params.status) queryParams.status = params.status;

    return this.apiService.get<Blob>(`${this.endpoint}/leave/export`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  // Dashboard data
  getDashboardStats(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Observable<any> {
    const queryParams: any = {};
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.get<any>(`${this.endpoint}/dashboard`, this.buildHttpParams(queryParams)).pipe(
      map(response => response.data)
    );
  }

  // Scheduled reports
  scheduleReport(reportId: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    parameters: Record<string, any>;
  }): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${reportId}/schedule`, schedule).pipe(
      map(response => response.data)
    );
  }

  getScheduledReports(): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/scheduled`).pipe(
      map(response => response.data)
    );
  }

  updateScheduledReport(id: string, updates: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/scheduled/${id}`, updates).pipe(
      map(response => response.data)
    );
  }

  deleteScheduledReport(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/scheduled/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Report sharing
  shareReport(reportId: string, recipients: string[], parameters: Record<string, any>): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${reportId}/share`, {
      recipients,
      parameters
    }).pipe(
      map(response => response.data)
    );
  }

  // Report history
  getReportHistory(params?: {
    reportId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<any>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const queryParams: any = {};
    if (params?.reportId) queryParams.reportId = params.reportId;
    if (params?.userId) queryParams.userId = params.userId;

    return this.apiService.getPaginated<any>(`${this.endpoint}/history`, page, limit, this.buildHttpParams(queryParams));
  }
}