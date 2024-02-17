import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'app/core/services/http.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface MultiLingualStringName {
  enName: string;
  arName: string;
}
export interface Parent {
  code: string;
  mobileNo: string;
  firstName: MultiLingualStringName;
  secondName: MultiLingualStringName;
  thirdName: MultiLingualStringName;
  familyName: MultiLingualStringName;
  nationalId: string;
  status: string;
}
export interface ParentsResult {
  parents: {
    metadata: { totalPages: number; totalItems: number };
    result: Parent[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  private env = environment.hostAPI
  private APIURL ='api/'  



  // Private
  private _pagination: BehaviorSubject<{ totalPages: number; totalItems: number } | null> = new BehaviorSubject(null);
  private _parents: BehaviorSubject<Parent[] | null> = new BehaviorSubject(null);


  constructor(private http: HttpService, private _http: HttpClient) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  /**
   * Getter for pagination
   */
  get pagination$(): Observable<{ totalPages: number; totalItems: number }> {
    return this._pagination.asObservable();
  }

  /**
   * Getter for school parents
   */
  get parents$(): Observable<Parent[]> {
    return this._parents.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get school parents
   *
   *
   * @param page
   * @param size
   * @param status
   */
  getSchoolParents(schoolCode: string, page: number = 1, size: number = 10, status?: string):
    Observable<ParentsResult> {
    return this.http.get<ParentsResult>(`api/v1/schools/${schoolCode}/parents`, {
      page,
      size,
      ...(status && { status })
    }).pipe(
      tap((response) => {
        this._pagination.next(response.parents?.metadata);
        this._parents.next(response.parents?.result);
      })
    );
  }

  /**
   * upload school parents
   * @param schoolCode
   * @param codes
   */
  sendParentsInvitations(schoolCode: string, codes: string[]) {
    return this.http.post(`api/v1/schools/${schoolCode}/parents/invite`, { codes });
  }

  /**
   * upload school parents
   * @param formData
   * @param schoolCode
   */
  uploadParentsOrStudents(formData: FormData, schoolCode: string, type: 'students' | 'parents'): Observable<HttpResponse<any>> {
    return this._http.post<any>(`${this.env}${this.APIURL}v1/schools/${schoolCode}/${type}-upload`, formData);
  }

}
