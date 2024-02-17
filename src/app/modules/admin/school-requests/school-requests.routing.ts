import { Route } from '@angular/router';
import { RequestsComponent } from './requests/requests.component';
import { RequestComponent } from './request/request.component';

export const schoolRequestsRoutes: Route[] = [
    {
        path: '',
        component: RequestsComponent,
    },
    {
        path: ':id',
        component: RequestComponent
    }
];
