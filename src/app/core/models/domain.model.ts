// Domain models for the edTech application

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  managerId?: string;
  avatar?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employee?: Employee;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxDays: number;
  requiresApproval: boolean;
  color: string;
  isActive: boolean;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  workingDays: string[]; // ['monday', 'tuesday', etc.]
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  employee?: Employee;
  shiftId: string;
  shift?: Shift;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: HolidayType;
  description?: string;
  isRecurring: boolean;
  tenantId: string;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type HolidayType = 'national' | 'regional' | 'company' | 'optional';

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours?: number;
  status: AttendanceStatus;
  location?: string;
  notes?: string;
  punches?: PunchRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave';

export interface PunchRecord {
  id: string;
  attendanceId: string;
  timestamp: Date;
  type: 'in' | 'out' | 'break_start' | 'break_end';
  location?: string;
  method: 'manual' | 'biometric' | 'mobile' | 'web';
  verified: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description?: string;
  parameters: ReportParameter[];
  query: string;
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType = 'attendance' | 'leave' | 'productivity' | 'payroll' | 'custom';

export interface ReportParameter {
  name: string;
  type: 'date' | 'daterange' | 'select' | 'multiselect' | 'text' | 'number';
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface ReportData {
  reportId: string;
  data: any[];
  totalRecords: number;
  generatedAt: Date;
  parameters: Record<string, any>;
  summary?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: Employee;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  data?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Request/Response types for API calls
export interface LeaveRequest {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  attachments?: File[];
}

export interface AttendanceRecord {
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  notes?: string;
}

export interface ShiftScheduleRequest {
  employeeId: string;
  shiftId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

// Dashboard and analytics types
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  upcomingHolidays: number;
}

export interface AttendanceSummary {
  date: Date;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
}

export interface LeaveSummary {
  employeeId: string;
  employeeName: string;
  totalLeaves: number;
  usedLeaves: number;
  pendingLeaves: number;
  leaveBalance: number;
}