import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-invetation-link',
  templateUrl: './invetation-link.component.html'
})
export class InvetationLinkComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }
  openSnackBar(message: string): void{
    this._snackBar.open(message, 'Close',{ duration: 2000 });
  }
}
