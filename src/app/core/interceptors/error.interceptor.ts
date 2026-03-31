import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - token might be expired
        authService.logout();
      } else if (error.status === 403) {
        // Forbidden - insufficient permissions
        console.error('Access forbidden:', error.message);
      } else if (error.status >= 500) {
        // Server error
        console.error('Server error:', error.message);
      }

      // Log error details
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: req.url
      });

      return throwError(() => error);
    })
  );
};