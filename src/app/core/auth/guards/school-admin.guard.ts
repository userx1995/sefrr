import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Role } from 'app/core/enums/role.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolAdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles: string[] = localStorage.getItem('role')?.split(',') || [];
    const hasSchoolAdminRole = roles.includes(Role.school_admin )|| roles.includes(Role.superAdmin) || roles.includes(Role.operationManager);

    if (!hasSchoolAdminRole) {
      // Redirect or handle unauthorized access
      return this.router.parseUrl('/required-permission');
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles: string[] = localStorage.getItem('role')?.split(',') || [];
    // const hasSchoolAdminRole = roles.includes(Role.school_admin);
    const hasSchoolAdminRole = roles.includes(Role.school_admin )|| roles.includes(Role.superAdmin) || roles.includes(Role.operationManager) ;

    if (!hasSchoolAdminRole) {
      // Redirect or handle unauthorized access
      return this.router.parseUrl('/required-permission');
    }

    return true;
  }


}
