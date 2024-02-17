import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Chat, Contact, Profile } from 'app/modules/admin/chat/chat.types';
import { HttpService } from 'app/core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class AdmissionService {
    admissionRequest = new BehaviorSubject({})

    /**
     * Constructor
     */
    constructor(
    ) {
    }
}
