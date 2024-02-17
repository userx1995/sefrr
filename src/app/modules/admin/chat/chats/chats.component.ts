import { AuthService } from 'app/core/auth/auth.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chat, Profile } from 'app/modules/admin/chat/chat.types';
import { ChatService } from 'app/modules/admin/chat/chat.service';
import { Router } from '@angular/router';
import { HttpService } from 'app/core/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from 'app/core/enums/role.enum';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: any[] = [];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: Profile;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userDetailsSubscription: Subscription;
    paginationPagesNumber: number;
    pageNumber: number = 1;

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private auth: AuthService,
        private router: Router,
        private http: HttpService,
        private _snackBar: MatSnackBar,
        private _changeDetectorRef: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {
    }


    formatDateTime(dateTime: Date): string {
        const now = new Date();
        const dateObject = new Date(dateTime);
        const isSameDay = dateObject.toDateString() === now.toDateString();

        if (isSameDay) {
            return this.datePipe.transform(dateTime, 'hh:mm a');
        } else {
            return this.datePipe.transform(dateTime, 'dd/MM/yyyy');
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    role;
    userProfile: any;
    /**
     * On init
     */
    ngOnInit(): void {
        this.userProfile = JSON.parse(localStorage.getItem('profile')) || {};

        // Chats
        // this._chatService.chats$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chats: Chat[]) => {
        //         this.chats = this.filteredChats = chats;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
        this.getGroups();



        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

    }
    getGroupMembers(id) {
        this._chatService.mebmers.next(id);
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.userDetailsSubscription?.unsubscribe();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter the chats
     *
     * @param query
     */
    getGroups(): void {
        var roles = localStorage.getItem('role').split(',') || [];
        const superRole = roles.filter(item => item === 'super_admin');


        this.http.get(superRole[0] == Role.superAdmin ? 'api/admin/conversations?page=1&limit=20' : `api/conversation/admin/${localStorage.getItem('userID')}/conversations?page=1&limit=20`).subscribe((res: any) => {
            this.chats = res.conversations;
            //this.chats = this.chats.sort((a, b) => b.id - a.id);
            this.paginationPagesNumber = Math.ceil(res.pagination?.total / 20);
            ++this.pageNumber;
        });

    }
    filterLetter(query: string): void {
        var filteredChats;
        // Reset the filter
        if (!query || query == "" || this.chats.length == 0) {
            this.paginationPagesNumber = 0;
            this.pageNumber = 1;
            this.getGroups();
            return;
        }

        filteredChats = this.chats.filter(chat => chat.name.toLowerCase().includes(query.toLowerCase()));
        if (filteredChats.length > 0) {
            this.chats = filteredChats;
        }

    }

    onScroll(event: any) {
        // visible height + pixel scrolled >= total height
        if (event.target.offsetHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
            this.getPagination();
        }
    }

    getPagination(): void {
        var roles = localStorage.getItem('role').split(',') || [];
        const superRole = roles.filter(item => item === 'super_admin');

        if (this.pageNumber <= this.paginationPagesNumber) {
            const url = superRole[0] == Role.superAdmin ? 'api/admin/conversations?page=' + this.pageNumber + '&limit=20' : `api/conversation/admin/${localStorage.getItem('userID')}/conversations?page=${this.pageNumber}&limit=20`
            //const url = 'api/admin/conversations?page=' + this.pageNumber + '&limit=20';

            this.http.get(url).subscribe((res: any) => {
                res.conversations.forEach(element => {
                    this.chats.push(element);
                });
                this.pageNumber = this.pageNumber + 1;

            });
        } else {
            this._snackBar.open('There is No More Data Avalabel !!', '', { duration: 2000 });
        }
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
    openCreateGroup(): void {
        this.router.navigate(['/create-group']);
    }

}
