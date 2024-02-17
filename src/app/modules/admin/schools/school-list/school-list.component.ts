import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { SchoolsService } from '../schools.service';
import { School, SchoolsPagination } from '../schools.types';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class SchoolListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  schools$: Observable<School[]>;

  isLoading: boolean = false;
  pagination: SchoolsPagination;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  schoolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  schoolsTableColumns: string[] = ['code', 'nameEn', 'nameAr', 'website', 'details'];


  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _schoolsService: SchoolsService,
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
    this._schoolsService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: SchoolsPagination) => {
        // Update the pagination
        this.pagination = pagination;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    this._schoolsService.schools$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((schools) => {
        // Update the pagination
        this.schoolsDataSource.data = schools;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the users
    this.schools$ = this._schoolsService.schools$;
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
          console.log('7sl', pageOptions);

          return this._schoolsService.getSchools(pageOptions.pageIndex, pageOptions.pageSize);
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
}

