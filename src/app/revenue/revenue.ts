import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RevenueService } from '../service/revenue.service';
import { NotificationService } from '../common/common.service';
import * as XLSX from 'xlsx';

export interface RevenueEntry {
  id: number;
  date: Date;
  fishname: string;
  soldqty: number;
  sold: number;
}

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './revenue.html',
  styleUrls: ['./revenue.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Revenue implements OnInit, AfterViewInit {
  
  revenueForm: FormGroup;
  displayedColumns = ['date', 'fishname', 'soldqty','sold', 'actions'];
  dataSource = new MatTableDataSource<RevenueEntry>();
  editingRevenueId: number | null = null;
  filterValue: string = '';
  fishList: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly fb: FormBuilder, private readonly revenueservice: RevenueService, private readonly snackBar: MatSnackBar, private readonly cdr: ChangeDetectorRef, private readonly notificationService: NotificationService) {
    this.revenueForm = this.fb.group({
      date: [new Date(), Validators.required], // Default to today
      fishname: ['', Validators.required],
      soldqty: ['', [Validators.required, Validators.min(0)]],
      sold: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadFishList();
    this.getrevenuemasterlist();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
    // Set up custom filter predicate to search across all text fields
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterLower = filter.toLowerCase().trim();
      
      // Search across all relevant fields
      return (
        (data.date ? new Date(data.date).toLocaleDateString().includes(filterLower) : false) ||
        data.fishname?.toLowerCase().includes(filterLower) ||
        data.soldqty?.toString().includes(filterLower) ||
        data.sold?.toString().includes(filterLower)
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

  /**
   * Load fish list for dropdown
   */
  loadFishList() {
    this.revenueservice.getFishList().subscribe({
      next: (data: any[]) => {
        this.fishList = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading fish list:', err);
        this.cdr.markForCheck();
      }
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date <= new Date();
  }

  /**
   * Compare function for mat-select with string values
   */
  compareFish(f1: any, f2: any): boolean {
    return f1 && f2 ? f1 === f2 : f1 === f2;
  }

  addRevenue() {
    if (this.revenueForm.invalid) return;

    const { date, fishname, soldqty, sold } = this.revenueForm.value;

    const body = {
      entryby: 'admin',
      entrydate: date,
      fishname: fishname,
      fishqty: soldqty,
      fishsold: sold
    };

    if (this.editingRevenueId) {
      // Update existing revenue
      this.revenueservice.updateRevenue(this.editingRevenueId, body).subscribe({
        next: () => {
          this.snackBar.open('Revenue updated successfully', 'OK', { duration: 2000 });
          this.revenueForm.reset();
          this.editingRevenueId = null;
          this.getrevenuemasterlist();
        },
        error: err => {
          console.error('Error updating revenue:', err);
          this.snackBar.open('Update failed', 'OK', { duration: 2000 });
        }
      });
    } else {
      // Create new revenue
      this.revenueservice.insertRevenuedetails(body).subscribe({
        next: () => {
          this.snackBar.open('Revenue added successfully', 'OK', { duration: 2000 });
          this.revenueForm.reset();
          this.getrevenuemasterlist();
        },
        error: err => {
          console.error('Error inserting revenue:', err);
          this.snackBar.open('Add failed', 'OK', { duration: 2000 });
        }
      });
    }
  }

  editRevenue(entry: RevenueEntry) {
    this.editingRevenueId = entry.id;
    // Patch form with correct fields
    this.revenueForm.patchValue({
      date: new Date(entry.date),
      fishname: entry.fishname,
      soldqty: entry.soldqty,
      sold: entry.sold
    });
  }

  deleteRevenue(id: any) {
    this.notificationService.showConfirmation(
      'Delete Revenue?',
      'This revenue entry will be permanently deleted.'
    ).then((confirmed) => {
      if (!confirmed) return;

      this.revenueservice.deleteRevenue(id).subscribe({
        next: () => {
          this.snackBar.open('Deleted successfully', 'OK', { duration: 2000 });
          this.getrevenuemasterlist();
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Delete failed', 'OK', { duration: 2000 });
        }
      });
    });
  }

  cancelEdit() {
    this.editingRevenueId = null;
    this.revenueForm.reset();
  }

  getrevenuemasterlist() {
    this.revenueservice.getRevenuedetails().subscribe({
      next: (data: any[]) => {
        // Map backend fields to RevenueEntry
        const mappedData = data.map(item => ({
          id: item.id,
          date: new Date(item.rev_date || item.entrydate),
          fishname: item.fish_name || item.fishname,
          soldqty: Number(item.fish_qty || item.fishqty),
           sold: Number(item.fish_sold || item.fishsold)
        }));

        // Wrap in setTimeout to avoid NG0100
        setTimeout(() => {
          console.log(mappedData);
          this.dataSource.data = mappedData;
        });
      },
      error: err => console.error('Error fetching revenue:', err)
    });
  }

  downloadExcel() {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const data = this.dataSource.data.map(row => ({
      'Date': new Date(row.date).toLocaleDateString('en-IN'),
      'Fish Name': row.fishname,
      'Quantity': row.soldqty,
      'Amount': row.sold
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue');
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 }
    ];

    XLSX.writeFile(workbook, 'Revenue_Report.xlsx');
  }
}
