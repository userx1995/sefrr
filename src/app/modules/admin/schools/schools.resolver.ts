import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Lookups, SchoolResult, SchoolsResult } from './schools.types';
import { SchoolsService } from './schools.service';
import { catchError } from 'rxjs/operators';
import { InvitationsService, ParentsResult } from './invitations.service';


@Injectable({
    providedIn: 'root'
})
export class SchoolsListResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _schoolsService: SchoolsService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SchoolsResult> {
        return this._schoolsService.getSchools();
    }
}


@Injectable({
    providedIn: 'root'
})
export class SchoolsSchoolResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _schoolsService: SchoolsService
    ) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SchoolResult> {
        return this._schoolsService.getSchoolById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested task is not available
                catchError((error) => {

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class SchoolParentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _invitationsService: InvitationsService
    ) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ParentsResult> {
        return this._invitationsService.getSchoolParents(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested task is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}


@Injectable({
    providedIn: 'root'
})
export class CitiesListResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _schoolsService: SchoolsService,
        private _router: Router,
    ) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ cities: Lookups[] }> {
        return this._schoolsService.getCities().pipe(
            // Error here means the requested task is not available
            catchError((error) => {

                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                this._router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            })
        );
    }
}
