import { Injectable } from "@angular/core";
import { HttpService } from "app/core/services/http.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Roles } from "./admin.types";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    _roles: BehaviorSubject<Roles[]> = new BehaviorSubject([])
    _users: BehaviorSubject<{ rows: any, pagination: { page: number, total: number } }> = new BehaviorSubject(null)

    constructor(private http: HttpService) {
    }

    get roles$(): Observable<Roles[]> {
        return this._roles.asObservable()
    }
    get users$(): Observable<{ rows: any, pagination: { page: number, total: number } }> {
        return this._users.asObservable()
    }


    getUsers(pageNumber: number = 1, search?: string): Observable<any> {
        return this.http.get('api/v1/users', {
            page: pageNumber,
            limit: 10,
            search: search ? search : ''
        }).pipe(
            tap((res: any) => {
                this._users.next({
                    rows: res?.users,
                    pagination: { page: Number(pageNumber) ? Number(pageNumber) : 1, total: res?.count }
                })
            }),
            catchError(err => {
                return of(err);
            })
        );
    }


    getRoles(): Observable<any> {
        return this.http.get<Roles[]>('api/v1/roles').pipe(
            tap((res: any) => {
                this._roles.next(res?.roles)
            }),
            catchError((error) => {
                return of(error)
            })
        );
    }
}
