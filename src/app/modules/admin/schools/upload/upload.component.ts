import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/core/services/http.service';
import { LoadingService } from 'app/core/services/loading.service';
import { InvitationsService } from '../invitations.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
    uploadForm: FormGroup;
    mainFile;
    uploadedFile: any = {};
    userTypes = ['students', 'parents'];
    schoolId: string;
    fileTypeError: boolean = false; 

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ref: ChangeDetectorRef,
        private loadingService: LoadingService,
        private _matDialogRef: MatDialogRef<UploadComponent>,
        private http: HttpService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _invitationService: InvitationsService,
    ) { }

    ngOnInit(): void {
        this.uploadForm = this._formBuilder.group({
            file: ['', Validators.required],
            type: ['', Validators.required],
        });
        console.log(this.data);
        this.schoolId = this.data.schoolId;

    }

    closePopup(): void {
        this._matDialogRef.close();
    }

    uploadFile(event: any) { //Angular 11, for stricter type
        this.mainFile = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.uploadedFile.url = _event.target.result;
            this.uploadedFile.type = event.target.files[0].type;
            this.uploadedFile.name = event.target.files[0].name;
            this.ref.detectChanges();
        }
    
        this.fileTypeError = this.validateFile(event.target.files[0]);
    }
    
    //function to validate file extensions 
    validateFile(file: File): boolean {
        const allowedTypes = /\.(csv|xlsx)$/i;
        return !allowedTypes.test(file.name); 
    }
    
    removeFile(): void {
        this.uploadForm.get('file').reset();
        this.mainFile = '';
        this.uploadedFile = {};
    }

    upload() {
        let formData = new FormData();
        formData.append('file', this.mainFile);
        this._invitationService.uploadParentsOrStudents(formData, this.schoolId, this.uploadForm.get('type').value).subscribe({
            next: (res: any) => {
                this._snackBar.open(res?.message, 'success', { duration: 4000 });
                this.closePopup();
            },
            error: (err) => {
                this._snackBar.open(err, 'error occured', { duration: 4000 });

            }
        })
    }

    checkTicketStatus(ticketId): void {
        var check = setInterval(() => {
            this.http.completeGet('api/invitation/ticket/' + ticketId + '/status').subscribe({
                next: (res: any) => {
                    if (res.status == "completed") {
                        this._snackBar.open('File Uploaded Successfully', '', { duration: 4000 });
                        clearInterval(check);
                    }
                    if (res.status == "error") {
                        this._snackBar.open('There is error in your file Please Upload Again', '', { duration: 4000 });
                        clearInterval(check);
                    }
                    if (res.status == "progress") {
                        this.loadingService.setLoading(true, 'api/invitation/ticket/' + ticketId + '/status');
                    }
                    this.loadingService.setLoading(false, 'api/invitation/ticket/' + ticketId + '/status');
                },
                error: (err) => {
                    clearInterval(check);
                },
            });
        }, 5000);
    }
}
