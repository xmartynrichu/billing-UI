import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../service/employee.service';
import { NotificationService } from '../common/common.service';
import { Employee, CreateEmployeeRequest } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './employee-master.html',
  styleUrls: ['./employee-master.css']
})
export class EmployeeMaster implements OnInit, OnDestroy, AfterViewInit {
  employeeForm: FormGroup;
  employees = new MatTableDataSource<Employee>();
  editingEmployeeId: number | null = null;
  displayedColumns: string[] = [
    'employeename',
    'designation',
    'salary',
    'dob',
    'mobilenumber',
    'location',
    'email',
    'actions'
  ];
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationService,
    private readonly snackBar: MatSnackBar
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEmployeeList();
  }

  ngAfterViewInit(): void {
    this.employees.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date <= new Date();
  }

  downloadExcel() {
    if (this.employees.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const data = this.employees.data.map(row => ({
      'Name': row.employeename,
      'Designation': row.designation,
      'Salary': row.salary,
      'DOB': new Date(row.dob).toLocaleDateString('en-IN'),
      'Mobile': row.mobilenumber,
      'Location': row.location,
      'Email': row.email
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 20 }
    ];

    XLSX.writeFile(workbook, 'Employee_Master.xlsx');
  }

  /**
   * Create form group with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      employeename: ['', [Validators.required, Validators.minLength(2)]],
      designation: ['', [Validators.required, Validators.minLength(2)]],
      salary: ['', [Validators.required, Validators.min(0)]],
      dob: ['', Validators.required],
      mobilenumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Load all employees
   */
  private loadEmployeeList(): void {
    this.isLoading = true;
    this.employeeService
      .getEmployeedetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Employee[]) => {
          this.employees.data = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
          this.notificationService.showError('Failed to load employee list');
          this.isLoading = false;
        }
      });
  }

  /**
   * Add or update employee
   */
  addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields correctly');
      return;
    }

    const {
      employeename,
      designation,
      salary,
      dob,
      mobilenumber,
      location,
      email
    } = this.employeeForm.value;

    const body: CreateEmployeeRequest = {
      entryby: 'admin',
      empname: employeename,
      empdesignation: designation,
      empsalary: salary,
      empdob: dob,
      empmobile: mobilenumber,
      emplocation: location,
      empemail: email
    };

    this.isLoading = true;
    this.employeeService
      .insertEmployeedetails(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            this.editingEmployeeId ? 'Employee updated successfully' : 'Employee added successfully'
          );
          this.resetForm();
          this.loadEmployeeList();
        },
        error: (err) => {
          console.error('Error saving employee:', err);
          this.notificationService.showError('Failed to save employee');
          this.isLoading = false;
        }
      });
  }

  /**
   * Edit employee
   */
  editEmployee(emp: Employee): void {
    this.editingEmployeeId = emp.id;
    this.employeeForm.patchValue({
      employeename: emp.employeename,
      designation: emp.designation,
      salary: emp.salary,
      dob: new Date(emp.dob),
      mobilenumber: emp.mobilenumber,
      location: emp.location,
      email: emp.email
    });
  }

  /**
   * Delete employee with confirmation
   */
  async deleteEmployee(id: number): Promise<void> {
    const confirmed = await this.notificationService.showConfirmation(
      'Delete Employee',
      'Are you sure you want to delete this employee?'
    );

    if (!confirmed) return;

    this.isLoading = true;
    this.employeeService
      .deleteEmployee(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Employee deleted successfully');
          this.loadEmployeeList();
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          this.notificationService.showError('Failed to delete employee');
          this.isLoading = false;
        }
      });
  }

  /**
   * Cancel editing and reset form
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    this.editingEmployeeId = null;
    this.employeeForm.reset();
  }
}
