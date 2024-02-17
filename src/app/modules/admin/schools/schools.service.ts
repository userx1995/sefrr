import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Lookups, School, SchoolPayload, SchoolResult, SchoolsResult } from './schools.types';
import { HttpService } from 'app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {
  // Private
  private _pagination: BehaviorSubject<{ totalPages: number; totalItems: number } | null> = new BehaviorSubject(null);
  private _school: BehaviorSubject<School | null> = new BehaviorSubject(null);
  private _schools: BehaviorSubject<School[] | null> = new BehaviorSubject(null);
  private _cities: BehaviorSubject<Lookups[] | null> = new BehaviorSubject(null);

  /**
   * Constructor
   */
  constructor(private http: HttpService) {
  }

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
   * Getter for school
   */
  get school$(): Observable<School> {
    return this._school.asObservable();
  }

  /**
   * Getter for schools
   */
  get schools$(): Observable<School[]> {
    return this._schools.asObservable();
  }

  /**
   * Getter for cities
   */
  get cities$(): Observable<Lookups[]> {
    return this._cities.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get schools
   *
   *
   * @param page
   * @param size
   */
  getSchools(page: number = 0, size: number = 10):
    Observable<SchoolsResult> {
    return this.http.get<SchoolsResult>('api/v1/schools', {
      page: page,
      size: size,
    }).pipe(
      tap((response) => {
        this._pagination.next(response.schools?.metadata);
        this._schools.next(response.schools?.result);
      }),
      catchError((error) => {
        // Continue with navigation even if there is an error
        return of(error);
      })
    );
  }

  /**
   * Get school by school code
   * @param schoolCode
   */
  getSchoolById(schoolCode: string): Observable<SchoolResult> {
    return this.http.get<SchoolResult>(`api/v1/schools/${schoolCode}`).pipe(
      tap((response) => {
        this._school.next(response.school);
      })
    );
  }

  /**
   * Create school
   * @param school
   */
  createSchool(school: SchoolPayload) {
    return this.http.post<School>('api/v1/schools', school);
  }

  /**
   * Update product
   *
   * @param id
   * @param school
   */
  updateSchool(id: string, school: SchoolPayload): Observable<School> {
    return this.http.put(`api/v1/schools/${id}`, school);
  }


  /**
 * get Cities
 *
 */
  getCities(): Observable<{ cities: Lookups[] }> {
    return this.http.get<{ cities: Lookups[] }>(`api/v1/lookups/cities`).pipe(
      tap((response) => {
        this._cities.next(response?.cities)
      }),
      catchError((error) => {
        return of(error)
      })
    );;
  }

  /**
 * Get areas list by city code
 * @param cityCode
 */
  getAreasByCityCode(cityCode: string): Observable<{ areas: Lookups[] }> {
    return this.http.get<{ areas: Lookups[] }>(`api/v1/lookups/cities/${cityCode}/areas`)
  }


  /**
   * upload school logo
   * @param formData
   * @param schoolCode
   */
  uploadSchoolLogo(formData: FormData, schoolCode: string) {
    return this.http.post(`api/v1/schools/${schoolCode}/logo-upload`, formData);
  }
}
