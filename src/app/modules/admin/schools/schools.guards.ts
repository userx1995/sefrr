import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SchoolDetailsComponent } from './school-details/school-details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateSchoolDetails implements CanDeactivate<SchoolDetailsComponent>
{
    canDeactivate(
        component: SchoolDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while (nextRoute.firstChild) {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/tasks'
        // it means we are navigating away from the
        // tasks app
        if (!nextState.url.includes('/tasks')) {
            // Let it navigate
            return true;
        }

        // If we are navigating to another task...
        if (nextRoute.paramMap.get('id')) {
            // Just navigate
            return true;
        }
        // Otherwise...
        else {
            return true;
        }
    }
}
