import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoanDto, LoanStatus, LoansResult } from './loans.types';
import { HttpService } from 'app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  // Private
  private _pagination: BehaviorSubject<{ totalPages: number; totalElements: number } | null> = new BehaviorSubject(null);
  private _loans: BehaviorSubject<LoanDto[] | null> = new BehaviorSubject(null);

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
  get pagination$(): Observable<{ totalPages: number; totalElements: number }> {
    return this._pagination.asObservable();
  }

  /**
   * Getter for schools
   */
  get schools$(): Observable<LoanDto[]> {
    return this._loans.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get loans
   *
   *
   * @param page
   * @param size
   */
  getLoans(page: number = 0, size: number = 10): Observable<LoansResult> {
    return this.http.get<LoansResult>('api/v1/loans', {
      page: page.toString(), size: size.toString()
    }).pipe(
      tap(
        (response) => {
          this._pagination.next({
            totalPages: response.loans?.totalPages,
            totalElements: response.loans?.totalElements,
          });
          this._loans.next(response.loans?.content);
        },
        (error) => {
          console.error('Error in getLoans:', error);
        }
      ),
      catchError((error) => {
        return of(error);
      })
    );
  }

  /**
   * Get schools
   *
   *
   * @param page
   * @param size
   */
  updateLoanStatus(loanCode: string, newStatus: LoanStatus):
    Observable<LoansResult> {
    return this.http.put(`api/v1/loans/${loanCode}?status=${newStatus}`, {});
  }
}
