import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolListComponent } from './school-list/school-list.component';

import { SharedModule } from 'app/shared/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SchoolDetailsComponent } from './school-details/school-details.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolDetailsComponent,
    ListComponent,
    UploadComponent,
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    SharedModule,
    MatTableModule
  ]
})
export class SchoolsModule { }
