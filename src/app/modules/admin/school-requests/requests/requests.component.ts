import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'app/core/services/http.service';
import { AdmissionService } from '../admission.service';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
    pendingRequests: any = [];
    acceptedRequests: any = [];
    deniedRequests: any = [];
    pageNumber: number = 1;
    paginationObj: any;

    constructor(
        private http: HttpService,
        private admission: AdmissionService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.getRequests();
    }
    getRequests(): void {
        this.http.getAdmission('api/v1/schools/applications?offset=0&limit=100&sort=desc&user_id=&school_id').subscribe((res: any) => {
            this.paginationObj = res.pagination;
            res.result.forEach((element: any) => {
                if (element.status == 'pending') {
                    this.pendingRequests.push(element);
                }
                if (element.status == 'approved') {
                    this.acceptedRequests.push(element);
                }
                if (element.status == 'rejected') {
                    this.deniedRequests.push(element);
                }
            });
        });
    }

    getRequestPagination(): void {
        this.pageNumber = this.pageNumber + 1;
        if (this.pageNumber <= this.paginationObj.totalCount) {
            const url = 'api/v1/schools/applications?offset=' + this.pageNumber + '&limit=6&sort=desc&user_id=&school_id';
            this.http.getAdmission(url).subscribe((res: any) => {
                res.result.forEach((element: any) => {
                    if (element.status == 'pending') {
                        this.pendingRequests.push(element);
                    }
                    if (element.status == 'approved') {
                        this.acceptedRequests.push(element);
                    }
                    if (element.status == 'rejected') {
                        this.deniedRequests.push(element);
                    }
                });
            });
        }
    }

    viewRequest(request: any): void {
        //this.admission.admissionRequest.next(request);
        const url = '/school-requestes/' + request.id;
        this.router.navigate([url], { queryParams: { id: request.id } });
    }

}
