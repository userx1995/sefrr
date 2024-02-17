import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contact } from 'app/modules/admin/chat/chat.types';
import { ChatService } from 'app/modules/admin/chat/chat.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpService } from 'app/core/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'chat-new-chat',
    templateUrl: './new-chat.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NewChatComponent implements OnInit, OnDestroy {
    searchForm: FormGroup;
    @Input() drawer: MatDrawer;
    contacts: any[] = [];
    filteredContacts: any[] = [];
    pageNumberSearch: number = 1;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _matDialogRef: MatDialogRef<NewChatComponent>,
        private http: HttpService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private chatService: ChatService,
        @Inject(MAT_DIALOG_DATA) public type: any,
        @Inject(MAT_DIALOG_DATA) public groupId: any,
        @Inject(MAT_DIALOG_DATA) public actionType: any
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.searchForm = this._formBuilder.group({
            search_key: ['', Validators.required]
        });

        // Contacts
        this.contacts = [];
        this.getDataNotFiltered();
    }

    getFiltered() {
        this.pageNumberSearch = 1;
        this.contacts = [];
        if (this.type.type == "moderator") {
            this.getUnAssignedAdmin();
        }
        else if (this.type.type == "member") {
            this.getUnAssignedUser();
        }
    }

    getDataNotFiltered() {
        if (this.type.type == "moderator") {
            this.getUnAssignedAdmin();
        }
        else if (this.type.type == "member") {
            this.getUnAssignedUser();
        }
    }

    getUnAssignedAdmin() {
        const body = {
            limit: 10,
            page: this.pageNumberSearch,
            search: this.searchForm.get('search_key').value ? this.searchForm.get('search_key').value : ''
        }
        this.http.get(`api/conversation/${this.type.groupId}/remainig-admins`, body).subscribe((res: any) => {
            res.admins.forEach((el: any) => {
                const obj = {
                    // name: el.first_name + ' ' + el.last_name,
                    name: el.username,
                    avatar: el.profile_picture,
                    phone: el.phone_number,
                    id: el.id,
                    selected: false
                };
                this.contacts.push(obj);
                this.contacts = this.contacts.sort((a, b) => a.name.localeCompare(b.name));
            });
        });
    }
    getUnAssignedUser() {
        const body = {
            limit: 10,
            page: this.pageNumberSearch,
            search: this.searchForm.get('search_key').value ? this.searchForm.get('search_key').value : ''
        }
        this.http.get(`api/conversation/${this.type.groupId}/remainig-users`, body).subscribe((res: any) => {
            this.contacts = res?.users?.map((el: any) => {
                const obj = {
                    name: el.username,
                    avatar: el.profile_picture,
                    phone: el.phone_number,
                    id: el.id,
                    code: el.user_code,
                    selected: false
                };
                return obj;
            }) || [];
            console.log("res.users", res.users);
            this.contacts = this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        });
        console.log("contacts", this.contacts);
    }

    select(e: any, index) {
        this.contacts[index].selected = e.checked;
    }

    assignUsers() {
        console.log("assignUsers", this.contacts)
        const selected = this.contacts?.filter((el: any) => el.selected);
        if (selected.length > 0) {
            let body = [];
            if (this.type.type == "moderator") {
                body = selected.map((el: any) => +el.id)
                console.log("selected Ids:", selected, body);

                this.http.post(`api/conversation/${this.type.groupId}/admins`, { admin_ids: [...body] }).subscribe((res: any) => {
                    this._matDialogRef.close();
                    this.chatService.mebmers.next(this.type.groupId);
                    this.chatService.getChatById(this.type.groupId);
                });
            }
            else if (this.type.type == "member") {
                body = selected.map((el: any) => el.code)
                console.log("selected codes:", selected, body);

                this.http.post(`api/conversation/${this.type.groupId}/members`, { user_codes: [...body] }).subscribe((res: any) => {
                    this._matDialogRef.close();
                    console.log("ID:", this.type.groupId);
                    this.chatService.mebmers.next(this.type.groupId);
                    this.chatService.getChatById(this.type.groupId);
                });
            }
        } else {
            this._snackBar.open('There is No Members Selected !!', '', { duration: 2000 });
        }
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.pageNumberSearch = 1;
    }

    onScroll(event: any) {
        // visible height + pixel scrolled >= total height
        if (event.target.offsetHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
            this.pageNumberSearch = this.pageNumberSearch + 1;
            this.getDataNotFiltered();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    filterChats(query: string): void {
        if (query == "") {
            this.pageNumberSearch = 1;
            this.contacts = [];
            this.getDataNotFiltered();
        }
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
    deleteMember(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Member',
            message: 'Are you sure you want to delete this memberName?',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // do delete function
            }
        });
    }
    blockContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Block Contact',
            message: 'Are you sure you want to block this contact?',
            actions: {
                confirm: {
                    label: 'Block'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // this.blockState = true;
            }
        });
    }
    closePopup(): void {
        this._matDialogRef.close();
    }
}
