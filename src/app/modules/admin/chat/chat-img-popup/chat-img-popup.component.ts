import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-chat-img-popup',
    templateUrl: './chat-img-popup.component.html',
    styleUrls: ['./chat-img-popup.component.scss']
})
export class ChatImgPopupComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) { }

    ngOnInit(): void {
        this.commigData.url;
    }

}
