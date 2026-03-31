import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Report,
  ReportData,
  ReportType,
  ReportParameter,
  PaginatedResponse
} from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly endpoint = 'reports';

  constructor(private apiService: ApiService) {}

  // Report Templates
  getReports(params?: {
    type?: ReportType;
    isPublic?: boolean;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Report>> {
    return this.apiService.getPaginated<Report>(this.endpoint, params);
  }

  getReportById(id: string): Observable<Report> {
    return this.apiService.get<Report>(`${this.endpoint}/${id}`);
  }

  createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Observable<Report> {
    return this.apiService.post<Report>(this.endpoint, report);
  }

  updateReport(id: string, report: Partial<Report>): Observable<Report> {
    return this.apiService.put<Report>(`${this.endpoint}/${id}`, report);
  }

  deleteReport(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Report Generation
  generateReport(reportId: string, parameters: Record<string, any>): Observable<ReportData> {
    return this.apiService.post<ReportData>(`${this.endpoint}/${reportId}/generate`, { parameters });
  }

  generateCustomReport(type: ReportType, parameters: Record<string, any>): Observable<ReportData> {
    return this.apiService.post<ReportData>(`${this.endpoint}/generate/${type}`, { parameters });
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
      ...params,
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    };
    return this.apiService.get<ReportData>(`${this.endpoint}/attendance`, queryParams);
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
      ...params,
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    };
    return this.apiService.get<ReportData>(`${this.endpoint}/leave`, queryParams);
  }

  getProductivityReport(params: {
    startDate: Date;
    endDate: Date;
    employeeId?: string;
    department?: string;
    metric?: string;
  }): Observable<ReportData> {
    const queryParams: any = {
      ...params,
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    };
    return this.apiService.get<ReportData>(`${this.endpoint}/productivity`, queryParams);
  }

  getPayrollReport(params: {
    month: number;
    year: number;
    employeeId?: string;
    department?: string;
  }): Observable<ReportData> {
    return this.apiService.get<ReportData>(`${this.endpoint}/payroll`, params);
  }

  // Export functionality
  exportReport(reportId: string, parameters: Record<string, any>, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    return this.apiService.download(`${this.endpoint}/${reportId}/export`, {
      ...parameters,
      format
    });
  }

  exportAttendanceReport(params: any, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    const queryParams: any = {
      ...params,
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString(),
      format
    };
    return this.apiService.download(`${this.endpoint}/attendance/export`, queryParams);
  }

  exportLeaveReport(params: any, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    const queryParams: any = {
      ...params,
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString(),
      format
    };
    return this.apiService.download(`${this.endpoint}/leave/export`, queryParams);
  }

  // Dashboard data
  getDashboardStats(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Observable<any> {
    const queryParams: any = {};
    if (params?.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params?.endDate) queryParams.endDate = params.endDate.toISOString();

    return this.apiService.get<any>(`${this.endpoint}/dashboard`, queryParams);
  }

  // Scheduled reports
  scheduleReport(reportId: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    parameters: Record<string, any>;
  }): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${reportId}/schedule`, schedule);
  }

  getScheduledReports(): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/scheduled`);
  }

  updateScheduledReport(id: string, updates: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/scheduled/${id}`, updates);
  }

  deleteScheduledReport(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/scheduled/${id}`);
  }

  // Report sharing
  shareReport(reportId: string, recipients: string[], parameters: Record<string, any>): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${reportId}/share`, {
      recipients,
      parameters
    });
  }

  // Report history
  getReportHistory(params?: {
    reportId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<any>> {
    return this.apiService.getPaginated<any>(`${this.endpoint}/history`, params);
  }
}