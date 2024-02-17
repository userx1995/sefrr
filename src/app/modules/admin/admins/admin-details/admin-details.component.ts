import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'app/core/services/http.service';

@Component({
    selector: 'app-admin-details',
    templateUrl: './admin-details.component.html'
})
export class AdminDetailsComponent implements OnInit {
    id: number;
    admin: any;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.id = params['id'];
        });
        this.getAdmin();
    }
    getAdmin(): void {
        const url = 'api/admin/' + this.id;
        this.http.get(url).subscribe((res: any) => {
            this.admin = res.admins;
        });
    }

    getWorkingHours(e) {
        console.log('getWorkingHours', e);
    }

}
