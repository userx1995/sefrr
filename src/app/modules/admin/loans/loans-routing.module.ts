import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoansListResolver } from './loans.resolver';

const routes: Routes = [{
  path: '',
  component: LoanListComponent,
  resolve: {
    schools: LoansListResolver,
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
