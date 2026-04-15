import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MasterService } from '../service/master.service';
import { NotificationService } from '../common/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-expense-label-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './expense-label-master.html',
  styleUrls: ['./expense-label-master.css'],
})
export class ExpenseLabelMaster implements OnInit, AfterViewInit {

  labelForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['id','label_name','amount','createdby','actions'];
  editingId: number | null = null;
  filterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly fb: FormBuilder,
    private readonly masterservice: MasterService,
    private readonly snackBar: MatSnackBar,
    private readonly notificationService: NotificationService
  ) {
    this.labelForm = this.fb.group({
      label_name: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getlabelmasterlist();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
    // Set up custom filter predicate to search across all text fields
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterLower = filter.toLowerCase().trim();
      
      // Search across all relevant fields
      return (
        data.id?.toString().toLowerCase().includes(filterLower) ||
        data.label_name?.toLowerCase().includes(filterLower) ||
        data.amt?.toString().includes(filterLower) ||
        data.amount?.toString().includes(filterLower) ||
        data.createdby?.toLowerCase().includes(filterLower)
      );
    };
  }

  applyFilter(event: any): void {
    // Set the filter value on the dataSource
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    
    // Reset to first page when filter changes
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadExcel() {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const data = this.dataSource.data.map(row => ({
      'ID': row.id,
      'Label': row.label_name,
      'Amount': row.amt || row.amount,
      'Created By': row.createdby
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Labels');
    
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 }
    ];

    XLSX.writeFile(workbook, 'Expense_Labels.xlsx');
  }

  addLabel() {
    const body = {
      label_name: this.labelForm.value.label_name,
      amount: this.labelForm.value.amount,
      entryby: 'admin'
    };

    this.masterservice.insertlabeldetails(body).subscribe({
      next: (res: any) => {
        this.snackBar.open('Saved successfully', 'OK', { duration: 2000 });
        this.getlabelmasterlist();
        this.labelForm.reset();
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open('Save failed', 'OK', { duration: 2000 });
      }
    });
  }

  editLabel(label: any) {
    this.editingId = label.id;
    this.labelForm.patchValue({
      label_name: label.label_name,
      amount: label.amt
    });
  }

  deleteLabel(id: number) {
    this.notificationService.showConfirmation(
      'Delete Label?',
      'This expense label will be permanently deleted.'
    ).then((confirmed) => {
      if (!confirmed) return;

      this.masterservice.deletelabelmaster(id).subscribe({
        next: () => {
          this.snackBar.open('Deleted successfully', 'OK', { duration: 2000 });
          this.getlabelmasterlist();
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Delete failed', 'OK', { duration: 2000 });
        }
      });
    });
  }

  getlabelmasterlist() {
    this.masterservice.getlabelmasterdetails().subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        console.log(this.dataSource.data);
      }
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.labelForm.reset();
  }
}
