import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceComponent } from '../pages/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthServiceComponent);
  const router = inject(Router);
  const token = sessionStorage.getItem(environment.TOKEN_NAME);
  if(token){
    const decodedToken: any = jwtDecode(token);
    const currentTime: number = Math.floor(Date.now() / 1000);
    const expirationTime: number = decodedToken.exp;
    if (expirationTime < currentTime) {
      // Token has expired
      return false
    } else {
      // Token is still valid
      return authService.isLoggedIn() ? true : router.createUrlTree(['/login']); 
    }
  }else{
    return false;
  }
};
