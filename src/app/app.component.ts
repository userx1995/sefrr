import { LoadingService } from './core/services/loading.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    isLoading = false;
    constructor(private loading: LoadingService) {
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loading.isLoading.subscribe(isLoading => {
            setTimeout(() => {
                this.isLoading = isLoading;
            });
        });
    }
}
