import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
    providedIn: 'root',
})
export class ChatsService {

    public message$: BehaviorSubject<string> = new BehaviorSubject('');
    private socketUrl = environment.socketAPI;


    socket = io(this.socketUrl, {
        transports: ['websocket'],
        path: '/ws',
        query: {
            user_id: localStorage.getItem('userID')
        },
        extraHeaders: {
            authorization: this.getToken()
        }
    }
    );


    sendMessage(msg: any) {
        this.socket.emit('send', msg);
    }


    getMessage() {
        return new Observable((observer: Observer<any>) => {
            this.socket.on('receive', (message: string) => {
                observer.next(message);
            });
        });
    }
    getError() {
        return new Observable((observer: Observer<any>) => {
            this.socket.on('error', (err: string) => {
                observer.next(err);
            });
        });
    }
    getToken() {
        const token = localStorage.getItem('token');
        const authorization = token ? `Bearer ` + token : ''
        console.log(token);
        return authorization

    }
}
