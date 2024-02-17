import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { chatRoutes } from 'app/modules/admin/chat/chat.routing';
import { ChatComponent } from 'app/modules/admin/chat/chat.component';
import { ChatsComponent } from 'app/modules/admin/chat/chats/chats.component';
import { ContactInfoComponent } from 'app/modules/admin/chat/contact-info/contact-info.component';
import { ConversationComponent } from 'app/modules/admin/chat/conversation/conversation.component';
import { NewChatComponent } from 'app/modules/admin/chat/new-chat/new-chat.component';
import { ProfileComponent } from 'app/modules/admin/chat/profile/profile.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseCardModule } from '@fuse/components/card';
import { ReplyMessageComponent } from './reply-message/reply-message.component';
import { InvetationLinkComponent } from './invetation-link/invetation-link.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UrlToHtmlPipe } from '@fuse/pipes/find-by-key/html-url.pipe';
import { ChatImgPopupComponent } from './chat-img-popup/chat-img-popup.component';
import { DatePipe } from '@angular/common';

@NgModule({
    providers: [
        MatSnackBarModule,
        DatePipe
    ],
    declarations: [
        UrlToHtmlPipe,
        ChatComponent,
        ChatsComponent,
        ContactInfoComponent,
        ConversationComponent,
        NewChatComponent,
        ProfileComponent,
        ReplyMessageComponent,
        InvetationLinkComponent,
        ChatImgPopupComponent
    ],
    imports: [
        RouterModule.forChild(chatRoutes),
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSidenavModule,
        SharedModule,
        MatRadioModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatStepperModule,
        FuseCardModule,
        ClipboardModule,
        MatDialogModule,
        MatSnackBarModule,
    ]
})
export class ChatModule {
}
