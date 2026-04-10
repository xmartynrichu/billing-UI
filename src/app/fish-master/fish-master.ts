/**
 * Fish Master Component
 * Manages fish inventory master data
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FishService } from '../service/fish.service';
import { NotificationService } from '../common/common.service';
import { Fish, CreateFishRequest } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-fish-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './fish-master.html',
  styleUrls: ['./fish-master.css']
})
export class FishMaster implements OnInit, OnDestroy {
  fishForm: FormGroup;
  fishDataSource = new MatTableDataSource<Fish>();
  editingFishId: number | null = null;
  displayedColumns: string[] = ['name', 'price', 'weight', 'actions'];
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly fishService: FishService,
    private readonly notificationService: NotificationService,
    private readonly snackBar: MatSnackBar
  ) {
    this.fishForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFishList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create form group with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Load all fish records
   */
  private loadFishList(): void {
    this.isLoading = true;
    this.fishService
      .getFishdetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Fish[]) => {
          this.fishDataSource.data = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching fish list:', err);
          this.notificationService.showError('Failed to load fish list');
          this.isLoading = false;
        }
      });
  }

  /**
   * Add or update fish record
   */
  addFish(): void {
    if (this.fishForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    const { name, price, weight } = this.fishForm.value;
    const body: CreateFishRequest = {
      entryby: 'admin',
      fishname: name,
      fishprice: price,
      fishweight: weight
    };

    this.isLoading = true;
    this.fishService
      .insertFishdetails(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            this.editingFishId ? 'Fish updated successfully' : 'Fish added successfully'
          );
          this.resetForm();
          this.loadFishList();
        },
        error: (err) => {
          console.error('Error saving fish:', err);
          this.notificationService.showError('Failed to save fish');
          this.isLoading = false;
        }
      });
  }

  /**
   * Edit fish record
   */
  editFish(fish: Fish): void {
    this.editingFishId = fish.id;
    this.fishForm.patchValue({
      name: fish.name,
      price: fish.price,
      weight: fish.weight
    });
  }

  /**
   * Delete fish record with confirmation
   */
  async deleteFish(id: number): Promise<void> {
    const confirmed = await this.notificationService.showConfirmation(
      'Delete Fish',
      'Are you sure you want to delete this fish?'
    );

    if (!confirmed) return;

    this.isLoading = true;
    this.fishService
      .deleteFish(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Fish deleted successfully');
          this.loadFishList();
        },
        error: (err) => {
          console.error('Error deleting fish:', err);
          this.notificationService.showError('Failed to delete fish');
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
    this.editingFishId = null;
    this.fishForm.reset();
  }
}
