import { LoadingService } from './../../../../core/services/loading.service';
import { HttpService } from './../../../../core/services/http.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
    selector: 'app-create-admin',
    templateUrl: './create-admin.component.html'
})
export class CreateAdminComponent implements OnInit {
    newAdminForm: FormGroup;
    imageUrl: any;
    editMode: boolean = false;
    adminInfo: any = [];
    governorates: [] = [];

    constructor(
        private _matDialogRef: MatDialogRef<CreateAdminComponent>,
        private _formBuilder: FormBuilder,
        private http: HttpService,
        private loading: LoadingService,
        private _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) { }

    get adminForm() {
        return this.newAdminForm.controls;
    }

    ngOnInit(): void {
        this.getGovernorates();
        this.newAdminForm = this._formBuilder.group({
            first_name: [''],
            last_name: [''],
            username: [''],
            phone_number: ['', [Validators.pattern(/^1[0-2,5]{1}[0-9]{8}$/),
            Validators.maxLength(10)]],
            password: ['', [Validators.required, Validators.minLength(8),
            Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\W)(?!.* ).{8,}')]],
            governorate: ['']
        });
        if (this.commigData.admin) {
            this.editMode = true;
            this.newAdminForm.patchValue(this.commigData.admin);
            this.newAdminForm.get('password').setValue('Test@1234');
            this.newAdminForm.get('password').setValidators(null);
            this.newAdminForm.get('password').setErrors(null);
            this.newAdminForm.get('phone_number').setValue(this.commigData.admin.phone_number.substring(3));
            this.newAdminForm.updateValueAndValidity();
        }
    }


    uploadAvatar(event): void {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event): void => {
            this.imageUrl = reader.result;
        };
    }
    createAdmin(): void {
        this.loading.isLoading.next(true);
        const body = {
            ...this.newAdminForm.value,
            phone_number: "0" + this.newAdminForm.get('phone_number').value,
            profile: "myprofile",
            profile_picture: "mypicture.png"
        };
        this.http.post('api/admin/register', body).subscribe(res => {
            this.loading.isLoading.next(false);
            this._matDialogRef.close();
        });
    }
    updateAdmin(): void {
        this.loading.isLoading.next(true);
        const body = {
            username: this.newAdminForm.get('username').value,
            phone_number: "0" + this.newAdminForm.get('phone_number').value,
        };
        const url = 'api/admin/' + this.commigData.admin.id;
        this.http.put(url, body).subscribe(res => {
            this.loading.isLoading.next(false);
            this._matDialogRef.close();
        });
    }
    removeAvatar(): void {
        this.imageUrl = null;
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
    getGovernorates(): void {
        this.http.get('api/data/governorates').subscribe((res: any) => {
            this.governorates = res.governorates;
        });
    }
}
