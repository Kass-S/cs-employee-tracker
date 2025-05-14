// Employee Interfaces
export interface Employee {
    id: number;
    name: string;
    jobTitle: string;
    hireDate: string;
}


// User Interfaces
export interface AuthInfo {
    email: string;
    password: string;
}

export interface AccountData {
    email: string;
    token: string;
}