import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';

@Injectable({
    providedIn: 'root',
})
export class AdminResolver implements Resolve<Observable<any>> {
    constructor(private adminService: AdminService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.adminService.getUsers();
    }
}
