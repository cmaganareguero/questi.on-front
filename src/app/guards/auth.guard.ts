import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthorizationService) as AuthorizationService;
  const router = inject(Router);
  if (authService?.isAuthenticated?.() === true) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
