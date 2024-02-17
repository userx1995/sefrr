import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { ActivatedRoute, Router } from '@angular/router';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { CreateUserComponent } from '../create-user/create-user.component';
import { AdminService } from '../admin.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-admin-list',
    templateUrl: './admin-list.component.html'
})
export class AdminListComponent implements OnInit {
    pageNumber: number = 1;
    admins: Observable<any>;
    adminDataSource: any;
    adminColumns = [
        'code',
        'username',
        'name',
        'roles',
        'status',
        // 'actions'
    ];
    adminsPagination: any;
    totalPages: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchValue;
    searchInput: FormControl = new FormControl();
    authSubscription!: Subscription;
    role: string;

    constructor(
        private _matDialog: MatDialog,
        private router: Router,
        private _router: ActivatedRoute,
        private adminService: AdminService,
        private location: Location,
        private _fuseConfirmationService: FuseConfirmationService,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.adminService.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe(users => {
            this.adminDataSource = users.rows
            this.adminsPagination = users.pagination
            this.totalPages = Math.ceil(users.pagination.total / 10);
        })
        this._router.queryParams.subscribe(res => {
            if(res.page) {
            this.navigationHelper(res.page)
            this.adminsPagination = {page: Number(res.page), total: this.totalPages}
            this.pageNumber = Number(res.page)
        } else {
                this.navigationHelper(1)
                this.adminsPagination = {page: 1, total: this.totalPages}
                this.pageNumber = 1

            }
        })
        this.searchInput.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((query: string) => {
                this.filterLetter(query);
            });

            this.authSubscription = this.authService.getUserRole().subscribe(res => {
                this.role = res
            })

        this.admins = this.adminService.users$
    }


    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    getNextAdmins(): void {
        ++this.pageNumber;
        if (this.pageNumber <= this.adminsPagination.total) {
            if (this.searchValue?.length <= 0) {
                this.filterLetter('');
            } else {
                this.navigationHelper(this.pageNumber)
            }
        }
    }

    getPrevAdmins(): void {
        --this.pageNumber;
        if (this.pageNumber <= this.adminsPagination.total) {
            if (this.searchValue?.length <= 0) {
                this.filterLetter('');
            } else {
                this.navigationHelper(this.pageNumber)
            }
        }
    }
    openAdminPopup(admin: any): void {
        const confirmation = this._matDialog.open(CreateUserComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                admin: admin
            },
            width: '50vw'
        });
        confirmation.afterClosed().subscribe((_result) => {
            this.navigationHelper()
        });
    }
    openCreateUserPopup(admin: any): void {
        const confirmation = this._matDialog.open(CreateUserComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                admin: admin
            },
            width: '50vw'
        });
        confirmation.afterClosed().subscribe((_result) => {
            this.navigationHelper()
        });
    }
    deleteAdmin(admin: any): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Admin',
            message: 'Are you sure you want to delete ' + admin.username + ' ?',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.openVerifyPassword(admin);
            }
        });
    }
    viewAdminPage(id: number): void {
        const url = '/admins/admin/' + id;
        this.router.navigate([url], { queryParams: { id: id } });
    }
    openResetPassPage(id: number): void {
        const confirmation = this._matDialog.open(ResetPasswordComponent, {
            autoFocus: false,
            data: {
                adminId: id,
                resetAdminPassword: true
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            this.navigationHelper()
        });
    }
    openVerifyPassword(admin: any): void {
        const confirmation = this._matDialog.open(VerifyPasswordComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
                adminId: admin.id,
                deleteAdmin: true
            }
        });
        confirmation.afterClosed().subscribe((result) => {

            this.navigationHelper()
        });
    }
    /**
     * Filter the users
     *
    * @param query
    */
    filterLetter(query?: string): void {
        if (!query) {
            this.navigationHelper()
        } else {
            const newUrl = this.location.path().split('?')[0] + `?search=${query}&page=1`;
            this.location.replaceState(newUrl)
            this.adminService.getUsers(1, query).subscribe(res => {
                this.adminDataSource = res;
            });
        }
    }

    navigationHelper(page: number = 1): void {
        const newUrl = this.location.path().split('?')[0] + `?page=${page}`;
        this.location.replaceState(newUrl);
        this.adminService.getUsers(page).subscribe(res => {
            this.adminDataSource = res.users
        });
    }

}
