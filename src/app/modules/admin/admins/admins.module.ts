import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminsComponent } from './admins.component';
import { Route, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { FuseCardModule } from '@fuse/components/card';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyPasswordComponent } from './verify-password/verify-password.component';
import { WorkingHoursComponent } from '../create-group/working-hours/working-hours.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AdminResolver } from './admin.resolver';

const adminRoutes: Route[] = [
  {
    path: '',
    component: AdminListComponent,
    resolve: {
      users: AdminResolver
    }
  },
  {
    path: 'admin/:id',
    component: AdminDetailsComponent
  }
];

@NgModule({
  declarations: [
    AdminListComponent,
    // CreateAdminComponent,
    CreateUserComponent,
    AdminsComponent,
    AdminDetailsComponent,
    ResetPasswordComponent,
    VerifyPasswordComponent,
    WorkingHoursComponent
  ],
  imports: [
    RouterModule.forChild(adminRoutes),
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    SharedModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    FuseCardModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ],
})
export class AdminsModule { }
