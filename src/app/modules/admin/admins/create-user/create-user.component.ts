import { LoadingService } from './../../../../core/services/loading.service';
import { HttpService } from './../../../../core/services/http.service';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AdminService } from '../admin.service';
import { Observable, Subject } from 'rxjs';
import { Roles } from '../admin.types';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html'
})


export class CreateUserComponent implements OnInit {
    newUserForm: FormGroup;
    editMode: boolean = false;
    userInfo: any = [];
    roles: Observable<Roles[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _matDialogRef: MatDialogRef<CreateUserComponent>,
        private _formBuilder: FormBuilder,
        private http: HttpService,
        private loading: LoadingService,
        private _matDialog: MatDialog,
        private adminService: AdminService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) { }

    get userForm() {
        return this.newUserForm.controls;
    }

    ngOnInit(): void {
        this.adminService.getRoles().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.roles = res.roles
        })
        this.newUserForm = this._formBuilder.group({
            name: [''],
            username: [''],
            password: ['', [Validators.required, Validators.minLength(8),
            Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\W)(?!.* ).{8,}')]],
            role_names: ['']
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createUser(): void {
        this.loading.isLoading.next(true);
        const body = {
            ...this.newUserForm.value,
        };
        this.http.post('api/v1/users', body, false).subscribe(res => {
            this._snackBar.open( 'User created succefully!', null, { duration: 2000 });
            this.loading.isLoading.next(false);
            this._matDialogRef.close();
        });
    }
    closePopup(): void {
        this._matDialogRef.close();
    }
    openResetPassPage(): void {
        const confirmation = this._matDialog.open(ResetPasswordComponent, {
            autoFocus: false,
            data: {
                adminId: this.commigData.admin.id,
                resetAdminPassword: true
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            // do something
        });
    }

}
