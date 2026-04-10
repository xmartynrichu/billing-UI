import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RevenueService } from '../service/revenue.service';

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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './revenue.html',
  styleUrls: ['./revenue.css']
})
export class Revenue implements OnInit {
  
  revenueForm: FormGroup;
  displayedColumns = ['date', 'fishname', 'soldqty','sold', 'actions'];
  dataSource = new MatTableDataSource<RevenueEntry>();
  editingRevenueId: number | null = null;

  constructor(private readonly fb: FormBuilder, private readonly revenueservice: RevenueService, private readonly snackBar: MatSnackBar) {
    this.revenueForm = this.fb.group({
      date: ['', Validators.required],
      fishname: ['', Validators.required],
      soldqty: ['', [Validators.required, Validators.min(0)]],
      sold: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.getrevenuemasterlist();
  }

  addRevenue() {
    if (this.revenueForm.invalid) return;

    const { date, fishname, soldqty,sold } = this.revenueForm.value;

    const body = {
      entryby: 'admin',
      entrydate: date,
      fishname: fishname,
      fishqty: soldqty,
      fishsold: sold
    };

    this.revenueservice.insertRevenuedetails(body).subscribe({
      next: () => {
        this.revenueForm.reset();
        this.getrevenuemasterlist();
      },
      error: err => console.error('Error inserting revenue:', err)
    });
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
    if (!confirm('Are you sure to delete?')) return;

    this.revenueservice.deleteRevenue(id).subscribe({
      next: () => this.getrevenuemasterlist(),
      error: err => console.error(err)
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
}
