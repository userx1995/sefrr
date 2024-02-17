import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { LoansService } from '../loans.service';
import { LoanDto, LoansPagination } from '../loans.types';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { loanDetailComponent } from '../loan-detail/loan-detail.component';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-loans-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class LoanListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  loans$: Observable<LoanDto[]>;

  isLoading: boolean = false;
  pagination: LoansPagination;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  loansDataSource: MatTableDataSource<any> = new MatTableDataSource();
  loansTableColumns: string[] = ['code', 'nameEnglish', 'requestedAmount', 'referenceNumber', 'status', 'download', 'details'];


  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _loansService: LoansService,
    private _matDialog: MatDialog,
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the pagination
    this._loansService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: LoansPagination) => {
        console.log('pagination', pagination);

        if (pagination) {
          // Update the pagination
          this.pagination = pagination;
          // Mark for check
          this._changeDetectorRef.markForCheck();
        }
      });

    this._loansService.schools$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((schools) => {
        // Update the pagination
        if (schools) {
          this.loansDataSource.data = schools;
          // Mark for check
          this._changeDetectorRef.markForCheck();
        }
      });

    // Get the users
    this.loans$ = this._loansService.schools$;
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    if (this._paginator) {
      // Get products if sort or page changes
      this._paginator.page.pipe(
        switchMap((pageOptions) => {
          this.isLoading = true;
          return this._loansService.getLoans(pageOptions.pageIndex, pageOptions.pageSize);
        }),
        map(() => {
          this.isLoading = false;
        })
      ).subscribe();
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


  openLoanDetailsPopup(loan: LoanDto): void {

    const confirmation = this._matDialog.open(loanDetailComponent, {
      disableClose: false,
      autoFocus: true,
      data: {
        loan: loan,
        loanCode: loan.code
      },
      width: '50vw'
    });
    confirmation.afterClosed().subscribe((result) => {
      this._loansService.getLoans().subscribe(res => {
        this.loans$ = this._loansService.schools$;
      });
    });
  }

  // Function to convert object to CSV and trigger download
  downloadCSV(loan: LoanDto) {

    const loanCSV = { ...loan } as any
    loanCSV.nationalId = loan.nationalId?.nationalId;
    loanCSV.monthlyIncome = loan.monthlyIncome?.amount;
    loanCSV.requestedAmount = loan.requestedAmount?.amount;

    // Convert object to CSV string
    const csv = Papa.unparse([loanCSV], { header: true });
    console.log(csv);

    // Create a Blob with the CSV string
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Set the download link attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `${loan.code}.csv`);

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Clean up
    document.body.removeChild(link);
  }
}

