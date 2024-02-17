import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {
    filtersForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _matDialogRef: MatDialogRef<FiltersComponent>
    ) { }

  ngOnInit(): void {
    this.filtersForm = this._formBuilder.group({
        age:  [''],
        gender:  [''],
        class:  [''],
        stage:  [''],
        school:  [''],
        district:  [''],
        parentClasses:  [''],
        education:  [''],
        governate:  [''],
    });
  }
  applyFilters(): void{
    this._matDialogRef.close();
  }
}
