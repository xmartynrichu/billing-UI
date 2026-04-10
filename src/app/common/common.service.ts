/**
 * Notification Service
 * Handles toast/alert notifications using SweetAlert2
 */

import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly DEFAULT_TOAST_TIMER = 1500;
  private readonly DEFAULT_POSITION = 'top-end';

  constructor() {}

  /**
   * Show success notification
   */
  showSuccess(message: string = 'Your work has been saved'): Promise<any> {
    return Swal.fire({
      position: this.DEFAULT_POSITION,
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: this.DEFAULT_TOAST_TIMER
    });
  }

  /**
   * Show error notification
   */
  showError(message: string = 'Something went wrong!'): Promise<any> {
    return Swal.fire({
      position: this.DEFAULT_POSITION,
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: this.DEFAULT_TOAST_TIMER
    });
  }

  /**
   * Show info notification
   */
  showInfo(message: string): Promise<any> {
    return Swal.fire({
      position: this.DEFAULT_POSITION,
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: this.DEFAULT_TOAST_TIMER
    });
  }

  /**
   * Show warning notification
   */
  showWarning(message: string): Promise<any> {
    return Swal.fire({
      position: this.DEFAULT_POSITION,
      icon: 'warning',
      title: message,
      showConfirmButton: false,
      timer: this.DEFAULT_TOAST_TIMER
    });
  }

  /**
   * Show confirmation dialog
   */
  async showConfirmation(
    title: string = 'Are you sure?',
    message: string = 'You cannot undo this action.'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue!',
      cancelButtonText: 'Cancel'
    });
    return result.isConfirmed;
  }
}

