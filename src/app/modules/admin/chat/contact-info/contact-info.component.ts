import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { VerifyPasswordComponent } from '../../admins/verify-password/verify-password.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'app/core/services/http.service';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkingHoursComponent } from '../../create-group/working-hours/working-hours.component';
import { sharedService } from 'app/core/services/shared.service';
import { LoadingService } from 'app/core/services/loading.service';
import { Router } from '@angular/router';

@Component({
    selector: 'chat-contact-info',
    templateUrl: './contact-info.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ContactInfoComponent implements OnInit {
    @ViewChild('imageFileInput') private _imageFileInput: ElementRef;
    @Input() chat: any;
    @Input() drawer: MatDrawer;
    workingHouresData: any;
    contacts: [] = [];
    groupAdmins: any = [];
    groupMembers: any = [];
    subscribtion: Subscription;
    editMode: boolean = false;
    groupForm: FormGroup;
    imageUrl: any;
    categories: [] = [];
    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _chatService: ChatService,
        private shared: sharedService,
        private _formBuilder: FormBuilder,
        private loading: LoadingService,
        private http: HttpService,
        private router: Router
    ) {
    }
    ngOnInit(): void {
        this.getCategories();
        this.chat;
        this.workingHouresData = { working_hours: this.chat.working_hours };
        this.subscribtion = this._chatService.mebmers.subscribe(res => {
            if (res) {
                this.chat.id = res;
                this.getMembers();
            }
        });
        this.initGroupForm();
    }
    ngOnChanges(): void {
        //this.groupForm.reset();
        this.workingHouresData = { working_hours: this.chat.working_hours };
        this.initGroupForm();
    }
    getCategories(): void {
        this.http.get('api/data/categories').subscribe((res: any) => {
            this.categories = res.categories;
        });
    }
    initGroupForm(): void {
        this.groupForm = this._formBuilder.group({
            picture: [''],
            name: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(300)]],
            category: ['', Validators.required],
            phone: ['', [Validators.pattern(/^1[0-2,5]{1}[0-9]{8}$/),
            Validators.maxLength(10)]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            facebook_url: ['', Validators.required],
            twitter_url: ['', Validators.required],
            youtube_url: ['', Validators.required],
            linkedin_url: ['', Validators.required],
            site_url: ['', Validators.required]
        });
        this.assignValues();
    }
    assignValues(): void {
        this.imageUrl = this.chat.picture;
        //this.groupForm.get('picture').setValue(this.chat.picture);
        this.groupForm.get('name').setValue(this.chat.name ?? this.chat.username);
        this.groupForm.get('description').setValue(this.chat.description);
        this.groupForm.get('category').setValue(this.chat.category);
        this.groupForm.get('phone').setValue(this.chat.verified_metadata?.phone.substring(1) ?? this.chat.phone_number);
        this.groupForm.get('address').setValue(this.chat.verified_metadata?.address);
        this.groupForm.get('city').setValue(this.chat.verified_metadata?.city);
        this.groupForm.get('facebook_url').setValue(this.chat.verified_metadata?.facebook_url);
        this.groupForm.get('twitter_url').setValue(this.chat.verified_metadata?.twitter_url);
        this.groupForm.get('youtube_url').setValue(this.chat.verified_metadata?.youtube_url);
        this.groupForm.get('linkedin_url').setValue(this.chat.verified_metadata?.linkedin_url);
        this.groupForm.get('site_url').setValue(this.chat.verified_metadata?.site_url);
    }
    uploadAvatar(event): void {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        this.http.postFile('upload/file/Image', formData).subscribe((res: any) => {
            this.imageUrl = res.result.file_url;
        });
    }
    removeAvatar(): void {
        this.imageUrl = null;
    }
    destroySubscrib() {
        //  this.subscribtion.unsubscribe();
    }
    getMembers(): void {
        this.groupAdmins = [];
        this.groupMembers = [];
        const url = `api/conversation/${this.chat.id}/members`;
        this.http.get(url).subscribe((res: any) => {
            this.contacts = res.users;
            this.contacts.filter((data: any) => {
                if (data.group_admin == true)
                    this.groupAdmins.push(data);
                else {
                    this.groupMembers.push(data);
                }
            });
        });
    }
    blockContact(contact: any): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Block Contact',
            message: 'Are you sure you want to Block ' + contact.username + '?',
            actions: {
                confirm: {
                    label: 'Block'
                }
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log(contact);
                const userId = {
                    user_codes: [
                        contact.user_code
                    ]
                };
                this.http.post(`api/conversation/${this.chat.id}/block`, userId).subscribe((res: any) => {
                    this.getMembers();
                });
            }
        });
    }
    unBlockContact(contact: any): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Unblock Contact',
            message: 'Are you sure you want to Unblock ' + contact.username + '?',
            actions: {
                confirm: {
                    label: 'Unblock'
                }
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const userId = {
                    user_codes: [
                        contact.user_code
                    ]
                };
                this.http.post(`api/conversation/${this.chat.id}/unblock`, userId).subscribe((res: any) => {
                    this.getMembers();
                });
            }
        });
    }
    deleteMember(contact: any): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Contact',
            message: 'Are you sure you want to delete ' + contact.username + '?',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.openVerifyPassword(contact);
            }
        });
    }
    openVerifyPassword(contact: any): void {
        const confirmation = this._matDialog.open(VerifyPasswordComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                conversitionId: this.chat.id,
                userId: +contact.user_id,
                deleteUserFromConversition: true
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            this.getMembers();
        });
    }
    openWorkingHours(): void {
        this.shared.workingHour$.next(this.workingHouresData);
        const confirmation = this._matDialog.open(WorkingHoursComponent, {
            autoFocus: false,
            disableClose: true,
            width: '1180px',
            data: {
                updateWorkingHours: true,
                chat: this.chat
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            this.shared.workingHour$.subscribe(res => {
                this.workingHouresData = res;
            });
        });
    }
    updateGroup(): void {
        this.loading.isLoading.next(true);
        const body = {
            ...this.workingHouresData,
            name: this.groupForm.get('name').value,
            picture: this.imageUrl,
            last_message: "",
            category: this.groupForm.get('category').value,
            description: this.groupForm.get('description').value,
            admins: this.chat.admins,
            verified_metadata: {
                city: this.groupForm.get('city').value,
                phone: "0" + this.groupForm.get('phone').value,
                address: this.groupForm.get('address').value,
                facebook_url: this.groupForm.get('facebook_url').value,
                youtube_url: this.groupForm.get('youtube_url').value,
                twitter_url: this.groupForm.get('twitter_url').value,
                linkedin_url: this.groupForm.get('linkedin_url').value,
                site_url: this.groupForm.get('site_url').value,
            }
        };
        this.http.put(`api/conversation/${this.chat.id}`, body).subscribe(res => {
            this.loading.isLoading.next(false);
            this.editMode = false;
            window.location.reload();
        });
    }
}
