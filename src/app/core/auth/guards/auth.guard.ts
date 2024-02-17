import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { Role } from 'app/core/enums/role.enum';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
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
        const token = localStorage.getItem('isLogined') || false;
        if (!token) {

            localStorage.clear();
        }
        return token ? true : this._router.navigateByUrl('/sign-in');
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = localStorage.getItem('isLogined') || false;
        if (!token) {
            localStorage.clear();
        }
        return token ? true : this._router.navigateByUrl('/sign-in');
    }

    // /**
    //  * Can load
    //  *
    //  * @param route
    //  * @param segments
    //  */
    // canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    // {
    //     return this._check('/');
    // }

}
