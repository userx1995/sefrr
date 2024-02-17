import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { HttpService } from 'app/core/services/http.service';
import { LoadingService } from 'app/core/services/loading.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    containNumber: boolean = false;
    containUppercase: boolean = false;
    containSpecialChar: boolean = false;

    alert: { type: FuseAlertType; message: string; } = {
        type: 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    valid: boolean = false;
    get form() {
        return this.resetPasswordForm.controls;
    }
    constructor(
        private _formBuilder: FormBuilder,
        private http: HttpService,
        private loading: LoadingService,
        private _matDialogRef: MatDialogRef<ResetPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) { }
    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(8),
            Validators.pattern(
                '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\W)(?!.* ).{8,}'
            )]],
            passwordConfirm: [null, Validators.required],
        },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }
    resetPassword() {
        if (this.commigData.resetAdminPassword == true) {
            const url = 'api/admin/' + this.commigData.adminId + '/password';
            const body = {
                ...this.resetPasswordForm.value
            };
            this.loading.isLoading.next(true);
            this.http.put(url, body).subscribe(res => {
                this.loading.isLoading.next(false);
                this._matDialogRef.close();
            });
        }
    }

    check(e) {
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        this.containNumber = e.match(/\d/);
        this.containUppercase = e.match(/[A-Z]/);
        this.containSpecialChar = e.match(specialChars);
    }
}
