import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TenantService } from '../services/tenant.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);

  let clonedRequest = req;

  // Add authorization header with JWT token
  const token = authService.getAccessToken();
  if (token) {
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Add tenant ID header
  const tenantId = tenantService.getTenantId();
  if (tenantId) {
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        'X-Tenant-ID': tenantId
      }
    });
  }

  return next(clonedRequest);
};