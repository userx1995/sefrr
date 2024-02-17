export interface School {
    code: string;
    website: string;
    name: {
        enName: string;
        arName: string;
    }

    totalNoOfStudents: number;
    contactPerson: {
        email: string;
        mobileNo: string;
        name: string;
    },
    address: {
        city: {
            code: string;
            name: string;
        },
        area: {
            code: string;
            name: string;
        },
        gov: string;
        street: string;
    }
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

export interface SchoolsResult {
    schools: {
        metadata: SchoolsPagination;
        result: School[]
    }
}
export interface SchoolResult {
    school: School
}

export interface SchoolsPagination {
    totalPages: number; totalItems: number;
}

export interface Lookups {
    name: string;
    code: string;
    multiLangName: {
        arName: string;
        enName: string;
    };
}
