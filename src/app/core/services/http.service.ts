import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface API {
    data: any;
    errorMessage: string;
    isSuccess: boolean;
    statusCode: number;
    successMessage: string;
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private serverUrl = environment.hostAPI;
    private loginUrl = environment.hostAPI + 'api/v1/';
    private filesUrl = environment.communityAPI + 's3/';
    private communityAPI = environment.communityAPI;
    private chatURL = environment.chatAPI;
    private admissionURL = environment.admissionAPI;

    constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

    get<T>(apiName: string, param?: any): Observable<T> {
        return this.http.get<any>(`${this.serverUrl}${apiName}`, { params: param }).pipe(map((event) => {
            return event.data;
        }
        ));
    }

    getAdmission<T>(apiName: string, param?: any): Observable<T> {
        return this.http.get<API>(`${this.admissionURL}${apiName}`, { params: param }).pipe(map((event) => {
            return event.data;
        }
        ));
    }

    putAdmission<T>(apiName: string, body?: any, showAlert = true): Observable<T> {
        return this.http.put<API>(`${this.admissionURL}${apiName}`, body ? body : null).pipe(map((event: any) => {
            showAlert ? this.alertHandling(event) : '';
            if (event.status) {
                return event.data;
            } else {
                console.log('errorMessage');
                this.errorHandling(event);
            }
            return event.data;
        }));
    }


    getCommunity(apiName) {
        return this.http.get<API>(`${this.communityAPI}${apiName}`).pipe(map((event) => {
            return event.data;
        }
        ));
    }

    getChat<T>(apiName: string): Observable<T> {
        return this.http.get<API>(`${this.chatURL}${apiName}`).pipe(map((event) => {
            return event.data;
        }
        ));
    }
    getToken<T>(apiName: string): Observable<T> {
        console.log('guest token url: ', `${this.loginUrl}${apiName}`, environment);

        return this.http.get<API>(`${this.loginUrl}${apiName}`).pipe(map((event) => {
            return event.data;
        }
        ));
    }


    post<T>(apiName: string, body?: any, showAlert = true): Observable<T> {
        return this.http.post<API>(`${this.serverUrl}${apiName}`, body ? body : null).pipe(map((event: any) => {
            showAlert ? this.alertHandling(event) : '';
            return event.data;
        }));
    }
    completePost<T>(apiName: string, body?: any, showAlert = true): Observable<T> {
        return this.http.post<API>(`${this.serverUrl}${apiName}`, body ? body : null).pipe(map((event: any) => {
            showAlert ? this.alertHandling(event) : '';
            return event;
        }));
    }

    completeGet<T>(apiName: string, showAlert = true): Observable<T> {
        return this.http.get<API>(`${this.serverUrl}${apiName}`).pipe(map((event: any) => {
            showAlert ? this.alertHandling(event) : '';
            return event;
        }));
    }

    postFile<T>(apiName: string, body?: any, showAlert = true): Observable<T> {
        return this.http.post<API>(`${this.filesUrl}${apiName}`, body ? body : null).pipe(map((event: any) => {
            showAlert ? this._snackBar.open('Uploaded Successfully', '', { duration: 2000 }) : '';
            return event.data;
        }));
    }

    postLogin<T>(apiName: string, body?: any, showAlert = true): Observable<T> {
        // Define headers
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            // Add any other headers as needed
        });

        // Set headers in options
        const options = {
            headers: headers
        };

        return this.http.post<API>(`${this.loginUrl}${apiName}`, body ? body : null, options).pipe(map((event: any) => {
            showAlert ? this.alertHandling(event) : '';
            if (event) {
                return event;
            } else {
                console.log('errorMessage', event);
                this.errorHandling(event);
            }
            return event;
        }));
    }


    put(apiName: string, body: any): Observable<any> {
        return this.http.put(`${this.serverUrl}${apiName}`, body).pipe(map((event: any) => {
            this.alertHandling(event);
            return event.data;
        }));
    }

    delete(apiName: string, body?: any): Observable<any> {
        return this.http.delete(`${this.serverUrl}${apiName}`, body).pipe(map((event: any) => {
            this.alertHandling(event);
            return event.data;
        }));
    }

    completeDelete<T>(apiName: string, body?: any): Observable<T> {
        const token = localStorage.getItem('token');
        const options = {
            headers: new HttpHeaders({
                Authorization: `Bearer ` + token
            }),
            body: body
        };
        return this.http.delete<API>(`${this.serverUrl}${apiName}`, options).pipe(map((event: any) => {
            this.alertHandling(event);
            return event;
        }));
    }


    alertHandling(event: any): void {
        this._snackBar.open(event.status ?? event.message, '', { duration: 2000 });
    }
    errorHandling(event: any): void {
        this._snackBar.open(event.errorMessage, '', { duration: 2000 });
    }
}