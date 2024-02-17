import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from './../../../environments/environment';
import { LoadingService } from './../services/loading.service';
import { HttpService } from './../services/http.service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    private token: string | null = null;
    currentLang = localStorage.getItem('userLang');
    errorMessage: string;

    constructor(
        private loadingService: LoadingService,
        private http: HttpService,
        private _snackBar: MatSnackBar,
        private router: Router
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        const auth = token ? `Bearer ` + token : ''
        request = request.clone({
            setHeaders: {
                Authorization: auth
                //"x-consumer-custom-id": "10001"
            },
        });
        if (request.url.includes(environment.hostAPI)) {
            this.loadingService.setLoading(true, request.url);
            return next.handle(request).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error && (error.status === 401 || error.status === 403)) {
                        // 401 errors are most likely going to be because we have an expired token that we need to refresh.
                        localStorage.removeItem('token');
                        this.router.navigate(['/sign-in']);
                        return throwError(error);
                    } else {
                        // alertHandling
                        if (error instanceof HttpErrorResponse) {
                            if (error.error.message) {
                                this._snackBar.open(error.error.message ? error.error.message : '!Error!', '', { duration: 2000 });
                            }
                            if (error.error.error.message) {
                                this._snackBar.open(error.error.error.message ? error.error.error.message : '!Error!', '', { duration: 2000 });
                            }
                            if (error.error.error) {
                                if (Array.isArray(error.error.error)) {
                                    error.error.error.forEach(element => {
                                        if (element.length > 1 && Array.isArray(element)) {
                                            this.errorMessage = element[0];
                                            return;
                                        }
                                        else {
                                            this.errorMessage = element;
                                        }
                                    });
                                } else {
                                    this._snackBar.open(error.error.error.message, error.error.error.developerMessage, { duration: 2000 });
                                }
                            }
                            if (
                                error.status === 500 ||
                                error.status === 502 ||
                                error.status === 503
                            ) {
                                this._snackBar.open(error.error.error ? error.error.error.error_message : '!Technical Error!', '', { duration: 2000 });
                            } else if (error.status === 400) {
                                this._snackBar.open(error.error.error ? this.errorMessage : '!BAD REQUEST!', '', { duration: 2000 });
                            } else if (error.status === 404) {
                                this._snackBar.open(error.error.error ? this.errorMessage : '!NOT FOUND!', '', { duration: 2000 });
                            } else if (error.status === 415) {
                                this._snackBar.open(error.error.error ? this.errorMessage : '!Unsupported Media Type!', '', { duration: 2000 });
                            } else {
                                this._snackBar.open(error.error.error ? this.errorMessage : '!!SYSTEM ERROR!!', '', { duration: 2000 });
                            }
                        }

                        return throwError(error);
                    }
                }),
                finalize(() => this.loadingService.setLoading(false, request.url))
            );
        } else {
            return next.handle(request);
        }
    }
}
