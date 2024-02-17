import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { HttpService } from '../services/http.service';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../enums/role.enum';

@Injectable()
export class AuthService {
    userRole = new BehaviorSubject<string | null>(null);
    /**
     * Constructor
     */
    constructor(
        private httpService: HttpService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Signs in the user with the provided payload.
     * 
     * @param payload - The payload containing the user's login credentials.
     * @returns An Observable that emits the response containing the user's token.
     */
    signIn(payload) {
        return this.httpService.postLogin('users/login', payload, false).pipe(
            map((res: any) => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('isLogined', 'true');

                let decoded: any = jwt_decode(res.token);



                localStorage.setItem('userID', decoded.user_code);
                localStorage.setItem('role', decoded.role_names[0]);

                return res;
            }))
    }

    getUserRole() {
        this.userRole.next(localStorage.getItem('role'));
        return this.userRole;
    }


    signOut(): void {
        localStorage.clear();
        setTimeout(() => {
            window.location.reload();
        }, 100)
        this._router.navigate(['/sign-out']);
    }

}
