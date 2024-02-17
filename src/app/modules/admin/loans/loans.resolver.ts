import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoansResult } from './loans.types';
import { LoansService } from './loans.service';


@Injectable({
    providedIn: 'root'
})
export class LoansListResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _loansService: LoansService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LoansResult> {
        return this._loansService.getLoans();
    }
}
