import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../service/user.service';
import { NotificationService } from '../common/common.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as XLSX from 'xlsx';

/**
 * Local User interface for userreport component
 * Maps from API response to component display format
 */
export interface UserDisplay {
  id: number;
  user_name: string;
  user_id: string;
  pass_wrd: string;
  dateofbirth: string;
  mobile_number: string;
  email_id: string;
  createdby: string;
  createdat: string;
}

@Component({
  selector: 'app-userreport',
  standalone: true,
  templateUrl: './userreport.html',
  styleUrls: ['./userreport.css'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    MatIconModule,
    DatePipe,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class Userreport implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id','user_name','user_id','email_id','mobile_number','createdat','actions'];
  dataSource = new MatTableDataSource<UserDisplay>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showModal = false;
  editingUserId: number | null = null;

  newUser: Partial<UserDisplay> = {
    user_name: '',
    user_id: '',
    pass_wrd: '',
    dateofbirth: '',
    mobile_number: '',
    email_id: '',
    createdby: 'admin'
  };

  constructor(
    private readonly userService: UserService, 
    private readonly snackBar: MatSnackBar,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date <= new Date();
  }

  downloadExcel() {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const data = this.dataSource.data.map(row => ({
      'ID': row.id,
      'Username': row.user_name,
      'User ID': row.user_id,
      'Email': row.email_id,
      'Mobile': row.mobile_number,
      'DOB': row.dateofbirth ? new Date(row.dateofbirth).toLocaleDateString('en-IN') : '',
      'Created By': row.createdby,
      'Created At': row.createdat
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 }
    ];

    XLSX.writeFile(workbook, 'User_Registry.xlsx');
  }

  // Fetch users
  loadUsers() {
    this.userService.getUserdetails().subscribe({
      next: (data: any[]) => {
        setTimeout(() => {
          this.dataSource.data = data as UserDisplay[];
          console.log('Users:', data);
        }, 0);
      },
      error: (err: any) => console.error('Error fetching users', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(id: number) {
    this.notificationService.showConfirmation(
      'Delete User?',
      'This user will be permanently deleted.'
    ).then((confirmed) => {
      if (!confirmed) return;

      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open('Deleted successfully', 'OK', { duration: 2000 });
          setTimeout(() => {
            this.loadUsers();
          }, 0);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Delete failed', 'OK', { duration: 2000 });
        }
      });
    });
  }

  openModal(edit: boolean = false) {
    this.showModal = true;
    if (!edit) this.resetForm();
  }

  closeModal() {
    this.showModal = false;
  }

  createOrUpdateUser() {
    if (this.editingUserId) {
      // Update user
      const updatedUser = { ...this.newUser, id: this.editingUserId } as any;
      this.userService.insertuserdetails(updatedUser).subscribe({
        next: () => {
          this.snackBar.open('User updated', 'OK', { duration: 2000 });
          this.closeModal();
          setTimeout(() => {
            this.resetForm();
            this.loadUsers();
          }, 0);
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Update failed', 'OK', { duration: 2000 });
        }
      });
    } else {
      // Create new user
      this.userService.insertuserdetails(this.newUser as any).subscribe({
        next: (res: any) => {
          this.snackBar.open(res.message || 'User created', 'OK', { duration: 2000 });
          this.closeModal();
          setTimeout(() => {
            this.resetForm();
            this.loadUsers();
          }, 0);
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('User creation failed', 'OK', { duration: 2000 });
        }
      });
    }
  }

  resetForm() {
    this.newUser = {
      user_name: '',
      user_id: '',
      pass_wrd: '',
      dateofbirth: '',
      mobile_number: '',
      email_id: '',
      createdby: 'admin'
    };
    this.editingUserId = null;
  }

  editUser(user: UserDisplay) {
    this.editingUserId = user.id;
    this.newUser = {
      user_name: user.user_name,
      user_id: user.user_id,
      pass_wrd: user.pass_wrd,
      dateofbirth: user.dateofbirth,
      mobile_number: user.mobile_number,
      email_id: user.email_id,
      createdby: user.createdby
    };
    this.openModal(true);
  }

  get isEditing(): boolean {
    return this.editingUserId !== null;
  }

  get formTitle(): string {
    return this.isEditing ? '✏️ Edit User' : '➕ Create New User';
  }

  get submitButtonText(): string {
    return this.isEditing ? 'Update User' : 'Save User';
  }

  get submitButtonIcon(): string {
    return this.isEditing ? 'update' : 'save';
  }
}
