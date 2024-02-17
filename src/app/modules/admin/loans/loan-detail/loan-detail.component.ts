import { LoadingService } from '../../../../core/services/loading.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoansService } from '../loans.service';
import { LoanStatus } from '../loans.types';

@Component({
    selector: 'app-loan-detail',
    templateUrl: './loan-detail.component.html'
})
export class loanDetailComponent implements OnInit {
    loanDataArray;

    constructor(
        private _matDialogRef: MatDialogRef<loanDetailComponent>,
        private loading: LoadingService,
        private loanService: LoansService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        const loanMod = { ...this.data.loan } as any

        loanMod.nationalId = loanMod.nationalId?.nationalId;
        loanMod.monthlyIncome = loanMod.monthlyIncome?.amount;
        loanMod.requestedAmount = loanMod.requestedAmount?.amount;

        delete loanMod['nationalIdBackImage'];
        delete loanMod['nationalIdFrontImage'];
        delete loanMod['drivingLicenseBackImage'];
        delete loanMod['drivingLicenseFrontImage'];

        this.loanDataArray = Object.entries(loanMod);
        console.log(this.loanDataArray);
    }
    updateLoanStatus(newLoanStatus: LoanStatus): void {
        this.loading.isLoading.next(true);
        this.loanService.updateLoanStatus(this.data.loanCode, newLoanStatus).subscribe(res => {
            this.loading.isLoading.next(false);
            this._matDialogRef.close();
        });
    }
    closePopup(): void {
        this._matDialogRef.close();
    }

    get loanStatusList(): string[] {
        return Object.values(LoanStatus);
    }
}
