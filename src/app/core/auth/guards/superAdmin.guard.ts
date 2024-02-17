import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { Role } from 'app/core/enums/role.enum';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate, CanActivateChild {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let token = localStorage.getItem('role').split(',') || [];
        const filteredToken = token.filter(item => item === 'super_admin' || item === 'operation_manager');
        return filteredToken[0] == Role.superAdmin || filteredToken[0] == Role.operationManager ? true : this._router.navigateByUrl('/required-permission');
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        var token = localStorage.getItem('role').split(',') || [];
        const filteredToken = token.find(item => item === 'super_admin' || item === 'operation_manager');
        return filteredToken == Role.superAdmin || filteredToken == Role.operationManager ? true : this._router.navigateByUrl('/required-permission');
    }


}
