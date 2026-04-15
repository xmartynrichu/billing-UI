/**
 * Employee Master Module Models
 */

export interface Employee {
  id: number;
  emp_name: string;
  emp_designation: string;
  emp_salary: string | number;
  emp_dob: string | Date;
  emp_mobile: string;
  emp_location: string;
  emp_email: string;
  createdby?: string;
  createdat?: string;
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
