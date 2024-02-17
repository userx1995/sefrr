import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { CreateGroupComponent } from './create-group.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatStepperModule } from '@angular/material/stepper';
import { Route, RouterModule } from '@angular/router';
import { FiltersComponent } from './filters/filters.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { MatDividerModule } from '@angular/material/divider';

const groupRoutes: Route[] = [
    {
        path: '',
        component: CreateGroupComponent
    }
];
@NgModule({
    declarations: [
        CreateGroupComponent,
        FiltersComponent,
        // WorkingHoursComponent
    ],
    imports: [
        RouterModule.forChild(groupRoutes),
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
        MatDatepickerModule,
        MatMomentDateModule,
        MatStepperModule,
        MatDialogModule,
        MatDividerModule
    ]
})
export class CreateGroupModule {
}
