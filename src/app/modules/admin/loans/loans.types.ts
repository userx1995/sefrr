export interface LoanDto {
    parentCode: string;
    code: string;
    schoolCode: string;
    status: string;
    nationalId: { nationalId: string };
    requestedAmount: { amount: number, scale: number };
    nameArabic: string;
    nameEnglish: string;
    email: string;
    referenceNumber: string;
    nationalIdFrontImage: string;
    nationalIdBackImage: string;
    monthlyIncome: { amount: number, scale: number };
    maritalStatus: string;
    dependents: number;
    referencePersonName: string;
    referencePersonMobileNumber: string;
    governorate: string;
    city: string;
    address: string;
    residentsStatus: string;
    drivingLicenseFrontImage: string;
    drivingLicenseBackImage: string;
}

export interface SchoolPayload {
    name: {
        enName: string;
        arName: string;
    }
    website: string;
    totalNoOfStudents: number;
    contactPerson: {
        mobileNo: string;
        email: string;
        name: string;
    },
    address: {
        city: string;
        area: string;
        gov: string;
        street: string;
    }
}

export interface LoansResult {
    loans: {
        content: LoanDto[];
        totalPages: number;
        totalElements: number;
    }
}

export interface LoansPagination {
    totalPages: number; totalElements: number;
}

export enum LoanStatus {
    PENDING = 'PENDING',
    SUBMITTED_TO_LENDER = 'SUBMITTED_TO_LENDER',
    PENDING_SIGNATURE = 'PENDING_SIGNATURE',
    SANCTIONED = 'SANCTIONED',
    DISBURSED = 'DISBURSED',
    REJECTED = 'REJECTED',
}