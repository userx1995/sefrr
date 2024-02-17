import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat } from 'app/modules/admin/chat/chat.types';
import { ChatService } from 'app/modules/admin/chat/chat.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { NewChatComponent } from '../new-chat/new-chat.component';
import { VerifyPasswordComponent } from '../../admins/verify-password/verify-password.component';
import { ReplyMessageComponent } from '../reply-message/reply-message.component';
import { InvetationLinkComponent } from '../invetation-link/invetation-link.component';
import { ChatsService } from 'app/core/services/chats.service';
import { LoadingService } from 'app/core/services/loading.service';
import { HttpService } from 'app/core/services/http.service';
import { Role } from 'app/core/enums/role.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatImgPopupComponent } from '../chat-img-popup/chat-img-popup.component';

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ConversationComponent implements OnInit, OnDestroy {
    @ViewChild('chatPlace') myScrollContainer: ElementRef;
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    blockState: boolean = false;
    msg;
    Role = Role;
    superAdminArea: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    message: string = 'hei dude, check this link http:://google.com and http:://youtube.com';
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _ngZone: NgZone,
        private loading: LoadingService,
        private http: HttpService,
        private messageService: ChatsService,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    _subscriptionMsg: Subscription
    ngOnInit(): void {
        var roles = localStorage.getItem('role').split(',') || [];
        const superRole = roles.filter(item => item === 'super_admin');
        this.superAdminArea = superRole[0];
        setTimeout(() => {
            this.myScrollContainer ? this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer?.nativeElement.scrollHeight : '';
        });
        this._subscriptionMsg = this.messageService.getMessage().subscribe((message: any) => {
            message.id = message.message_id;
            if (message.sender_id == localStorage.getItem('userID')) {
                message.isMine = true;
            } else {
                message.isMine = false;
            }
            //console.log('this.chat.messages', this.chat.messages);
            this.chat.messages.push(message);
        });

        // Chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.chat = chat;
                this.messageService.getError().subscribe((err: any) => {
                    err && this.chat.messages.pop();
                    this._snackBar.open(err, '', { duration: 2000 });

                });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._subscriptionMsg.unsubscribe()
    }
    unBlockContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Unblock Contact',
            message: 'Are you sure you want to Unblock this contact?',
            actions: {
                confirm: {
                    label: 'Unblock'
                }
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.blockState = false;
            }
        });
    }
    deleteMember(actionType: string): void {
        this._matDialog.open(NewChatComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
                actionType: actionType
            }
        });
    }
    deleteGroup(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Group',
            message: 'Are you sure you want to delete groupName ?',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.openVerifyPassword();
            }
        });
    }
    openVerifyPassword(): void {
        const confirmation = this._matDialog.open(VerifyPasswordComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
            }
        });
        confirmation.afterClosed().subscribe((result) => {
        });
    }
    sendMessageToAll(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Send To All',
            message: 'This message will sent to all group members ?',
            actions: {
                confirm: {
                    label: 'Send'
                }
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                if (this.imgUrl?.length > 0) {
                    this.sendImgOnline();
                } else {
                    this.sendMessage();
                }
            }
        });
    }

    sendMessage(): void {
        const body = {
            conversation_id: +this.chat.id,
            message: this.msg,
            file_paths: this.file?.result?.file_url ? [this.file?.result?.file_url] : [], // ...this.file?.result?.file_url TODO
            num_files: this.file ? 1 : 0,
            attachment_type: this.file ? this.file?.result?.file_type : null,
            has_attachment: this.file ? true : false,
            message_parent_id: null,
            organization_private_user_id: null
        };
        this.messageService.sendMessage(body);
        const msgSender = {
            id: null,
            isMine: true,
            conversation_id: +this.chat.id,
            "message": this.file ? '' : this.msg,
            "timestamp": new Date(),
            file_paths: [this.file?.result?.file_url],
            "num_files": this.file ? 1 : 0,
            "attachment_type": this.file ? this.file?.result?.file_type : null,
            "has_attachment": this.file ? true : false,
            "message_parent_id": null,
            "is_organization": true,
            "organization_private_user_id": null,
            "sender": {
                "id": null,
                "username": "",
            },
            "is_starred": false
        };
        //this.chat.messages.push(msgSender);
        this.msg = "";
        this.imgUrl = "";
        this.file = null;
        document.getElementById('msgFeild').style.height = 'auto';
    };

    file: any;
    imgUrl;
    transferedData;
    uploadAttactment(event): void {
        this.transferedData = event;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.imgUrl = _event.target.result;
        }
    }

    sendImgOnline() {
        const formData = new FormData();
        this.loading.isLoading.next(true)
        formData.append('file', this.transferedData.target.files[0]);
        this.http.postFile(this.transferedData.target.files[0].type.includes('image') ? 'upload/file/Image' : 'upload/file/File', formData).subscribe((res: any) => {
            this.file = res;
            this.sendMessage();
            this.loading.isLoading.next(false);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the contact info
     */
    openContactInfo(): void {
        // Open the drawer
        //console.log('openContactInfo', this.chat.id);
        this.drawerOpened = true;
        this._chatService.mebmers.next(this.chat.id);
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
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
    openMembersList(type: string): void {
        this._chatService.mebmers.next(null);
        this._matDialog.open(NewChatComponent, {
            disableClose: true,
            autoFocus: false,
            width: '500px',
            data: {
                type: type,
                groupId: this.chat.id
            }
        });
    }

    replayedMsg(message_parent_id) {
        return this.chat.messages.find((o: any) => o.id === message_parent_id);
    }
    replyMessage(message: any): void {
        const confirmation = this._matDialog.open(ReplyMessageComponent, {
            disableClose: true,
            autoFocus: false,
            width: '500px',
            data: {
                conversationId: message.conversation_id,
                msgParentId: message.id,
                privateUser: message.sender_id
            }
        });
        confirmation.afterClosed().subscribe(result => {
            //console.log('result', result);
            // this.chat.messages.push(result.data);
        });
    }

    linkInvitation(): void {
        this._matDialog.open(InvetationLinkComponent, {
            autoFocus: false,
            width: '600px',
            data: {
            }
        });
    }

    offset = 1;
    loadMore() {
        if (this.chat.hasNextPage) {
            this._chatService.getChatMessages(this.chat.id, this.chat.nextOffset);
        }
    }

    isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    openImgPop(url): void {
        const confirmation = this._matDialog.open(ChatImgPopupComponent, {
            autoFocus: false,
            panelClass: 'chat-img-popup',
            data: {
                url: url
            }
        });
        confirmation.afterClosed().subscribe((result) => {
        });
    }
}
