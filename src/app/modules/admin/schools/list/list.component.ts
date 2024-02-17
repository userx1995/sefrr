import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, tap } from 'rxjs/operators';
import { UploadComponent } from '../upload/upload.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvitationsService, Parent } from '../invitations.service';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { user } from 'app/mock-api/common/user/data';

@Component({
    selector: 'app-parents-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;

    invitationStatus$: BehaviorSubject<string> = new BehaviorSubject(null);
    pageOption$: BehaviorSubject<{ page: number; size: number }> = new BehaviorSubject(null);

    schoolId: string;

    isLoading: boolean = false;
    pagination: any;  // TODO: add type
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    parentsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    parentsTableColumns: string[] = ['select', 'code', 'firstName', 'lastName', 'mobileNo', 'nationalId', 'status'];

    statusTypes: any = ['INITIAL', 'INVITED', 'PENDING_VERIFICATION', 'ACTIVE'];

    initialSelection = [];
    allowMultiSelect = true;
    selection = new SelectionModel<Parent>(true);

    constructor(
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _invitationsService: InvitationsService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,

    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {    // Get the pagination
        this.schoolId = this._activatedRoute.snapshot.paramMap.get('id');
        this._invitationsService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: any) => { //TODO: type
                // Update the pagination
                this.pagination = pagination;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._invitationsService.parents$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((parents) => {
                // Update the pagination
                this.parentsDataSource.data = parents;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
    * After view init
    */
    ngAfterViewInit(): void {
        if (this._paginator) {
            this._paginator.page.pipe(
                tap((pageOptions) => {
                    this.pageOption$.next({
                        page: pageOptions.pageIndex,
                        size: pageOptions.pageSize
                    })
                })
            ).subscribe();
        }

        // Combine them using combineLatest
        const combined$ = combineLatest([this.pageOption$, this.invitationStatus$]);

        // Subscribe to the combined observable
        combined$.subscribe(([pageOption, invitationStatus]) => {
            // this.isLoading = true;
            return this._invitationsService.getSchoolParents(this.schoolId, pageOption?.page ? pageOption?.page + 1 : 1, pageOption?.size ? pageOption?.size : 10, invitationStatus).subscribe({
                next: () => {
                    // this.isLoading = false;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
            });
        });
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
     * Filter by status
     *
     * @param change
     */
    filterByStatus(change: MatSelectChange): void {
        this.invitationStatus$.next(change.value);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openUploadUserPopup(): void {
        const confirmation = this._matDialog.open(UploadComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                schoolId: this.schoolId
            }
        });
        confirmation.afterClosed().subscribe((_result) => {
            // Mark for check
            this._changeDetectorRef.markForCheck();
            // this.filterLetter();
        });
    }


    sendInvitation() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Send Invitation',
            message: 'Are you sure you want to send Invitation to the selected Parents?',
            actions: {
                confirm: {
                    label: 'Send',
                    color: 'primary'
                }
            },
            icon: {
                color: 'primary',
                name: "mat_solid:send"
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const codes = this.selection.selected.map((parent => parent.code));
                this._invitationsService.sendParentsInvitations(this.schoolId, codes).subscribe({
                    next: () => {
                        this.selection.deselect()
                        this._invitationsService.getSchoolParents(this.schoolId).subscribe();
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    }
                })
            }
        });
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.parentsDataSource.data.length;
        return numSelected == numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.parentsDataSource.data.forEach(row => this.selection.select(row));
    }
}
