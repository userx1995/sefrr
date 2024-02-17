import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface API {
}

@Injectable({
    providedIn: 'root'
})
export class sharedService {
    workingHour$ = new BehaviorSubject({})

}
