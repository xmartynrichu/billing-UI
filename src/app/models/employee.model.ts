/**
 * Employee Master Module Models
 */

export interface Employee {
  id: number;
  employeename: string;
  designation: string;
  salary: number;
  dob: Date;
  mobilenumber: string;
  location: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEmployeeRequest {
  entryby: string;
  empname: string;
  empdesignation: string;
  empsalary: number;
  empdob: Date;
  empmobile: string;
  emplocation: string;
  empemail: string;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: number;
}
