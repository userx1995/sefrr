import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AdmissionService } from '../admission.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpService } from 'app/core/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
    request: any;
    id: any;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private admission: AdmissionService,
        private router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.id = +params['id'];
        });
        this.getRequest();
    }

    getRequest(): void {
        this.http.getAdmission('api/v1/schools/applications/' + this.id).subscribe((res: any) => {
            this.request = res.result;
        });
    }


    updateRequest(action: string, id: number): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: action + ' Request',
            message: 'Are you sure to ' + action + ' Request ?',
            actions: {
                confirm: {
                    label: action
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            const url = 'api/v1/schools/applications/' + id + '/status';
            const body = {
                "status": action
            }
            if (result === 'confirmed') {
                this.http.putAdmission(url, body).subscribe(res => {
                    this.router.navigate(['/school-requestes']);
                });
            }
        });
    }
}
