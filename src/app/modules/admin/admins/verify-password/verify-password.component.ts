import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { HttpService } from 'app/core/services/http.service';
import { LoadingService } from 'app/core/services/loading.service';

@Component({
    selector: 'app-verify-password',
    templateUrl: './verify-password.component.html'
})
export class VerifyPasswordComponent implements OnInit {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    verifyPasswordForm: FormGroup;
    showAlert: boolean = false;
    constructor(
        private _formBuilder: FormBuilder,
        private loading: LoadingService,
        private http: HttpService,
        private _matDialogRef: MatDialogRef<VerifyPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) {
    }

    ngOnInit(): void {
        this.verifyPasswordForm = this._formBuilder.group({
            password: ['', [Validators.required,]]
        });
    }
    verify(): void {
        if (this.commigData.deleteAdmin == true) {
            const body = {
                ...this.verifyPasswordForm.value
            }
            const url = 'api/admin/' + this.commigData.adminId + '/remove';
            this.loading.isLoading.next(true);
            this.http.post(url, body).subscribe(res => {
                this.loading.isLoading.next(false);
                this._matDialogRef.close();
            });
        }
        if (this.commigData.deleteUserFromConversition == true) {
            this.loading.isLoading.next(true);
            const userId = {
                user_codes: [
                    this.commigData.user_code
                ]
            };
            this.http.post(`api/conversation/${this.commigData.conversitionId}/members/remove`, userId).subscribe((res: any) => {
                this.loading.isLoading.next(false);
                this._matDialogRef.close();
            });
        }
    }
    closePopup(): void {
        this._matDialogRef.close();
    }
}
