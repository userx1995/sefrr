import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent } from './requests/requests.component';
import { RouterModule } from '@angular/router';
import { schoolRequestsRoutes } from './school-requests.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestComponent } from './request/request.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';



@NgModule({
    declarations: [
        RequestsComponent,
        RequestComponent
    ],
    imports: [
        RouterModule.forChild(schoolRequestsRoutes),
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        FuseCardModule
    ]
})
export class SchoolRequestsModule { }
