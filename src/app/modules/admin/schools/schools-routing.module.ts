import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolListComponent } from './school-list/school-list.component';
import { CitiesListResolver, SchoolParentsResolver, SchoolsListResolver, SchoolsSchoolResolver } from './schools.resolver';
import { SchoolDetailsComponent } from './school-details/school-details.component';
import { CanDeactivateSchoolDetails } from './schools.guards';

const routes: Routes = [{
  path: '',
  component: SchoolListComponent,
  resolve: {
    schools: SchoolsListResolver,
  },
},
{
  path: 'new',
  component: SchoolDetailsComponent,
  resolve: {
    cities: CitiesListResolver
  },
  canDeactivate: [CanDeactivateSchoolDetails]
},
{
  path: ':id',
  component: SchoolDetailsComponent,
  resolve: {
    school: SchoolsSchoolResolver,
    // parents: SchoolParentsResolver,
    cities: CitiesListResolver
  },
  canDeactivate: [CanDeactivateSchoolDetails]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolsRoutingModule { }
