import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatsService } from 'app/core/services/chats.service';
import { Chat } from '../chat.types';

@Component({
    selector: 'app-reply-message',
    templateUrl: './reply-message.component.html'
})
export class ReplyMessageComponent implements OnInit {
    replyForm: FormGroup;
    chat: Chat;

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<ReplyMessageComponent>,
        private messageService: ChatsService,
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) { }

    ngOnInit(): void {
        this.replyForm = this._formBuilder.group({
            message: ['', Validators.required],
        });
    }

    sendReply(): void {
        const body = {
            conversation_id: +this.commigData.conversationId,
            message: this.replyForm.get('message').value,
            message_parent_id: +this.commigData.msgParentId,
            organization_private_user_id: +this.commigData.privateUser
        };
        this.messageService.sendMessage(body);
        const replySender = {
            id: null,
            isMine: true,
            conversation_id: +this.commigData.conversationId,
            "message": this.replyForm.get('message').value,
            "timestamp": new Date(),
            "file_paths": [],
            "num_files": 0,
            "attachment_type": null,
            "has_attachment": false,
            "message_parent_id": +this.commigData.msgParentId,
            "is_organization": true,
            "organization_private_user_id": +this.commigData.privateUser,
            "sender": {
                "id": null,
                "username": "",
            },
            "is_starred": false
        };
        this._matDialogRef.close({ data: replySender });
    };


    closePopup(): void {
        this._matDialogRef.close();
    }

}
