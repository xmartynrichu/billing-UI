import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoginService } from '../service/login.service';
import { NotificationService } from '../common/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  username = '';
  password = '';
  showModal = false;

  newUser = {
    user_name: '',
    user_id: '',
    pass_wrd: '',
    dateofbirth: '',
    mobile_number: '',
    email_id: '',
    createdby: 'system'
  };

  constructor(
    private router: Router,
    private loginservice: LoginService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {}

  // Date filter - only allow past and current dates
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date <= new Date();
  };

  // Email validation pattern
  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Mobile number validation - exactly 10 digits
  isValidMobile(mobile: string): boolean {
    const mobilePattern = /^\d{10}$/;
    return mobilePattern.test(mobile);
  }

  // Date of birth validation - not a future date
  isValidDOB(dob: any): boolean {
    if (!dob) return false;
    const selectedDate = new Date(dob);
    const today = new Date();
    return selectedDate <= today;
  }

  login() {
    if (!this.username || !this.password) {
      this.notify.showInfo('Enter username and password');
      return;
    }

    const userData = {
      username: this.username,
      pwd: this.password
    };

    this.loginservice.checkloginuser(userData).subscribe({
      next: (res: any) => {
        if (res.message == 'Success') {
          localStorage.setItem('username', this.username);
          this.resetlogin();
          this.notify.showSuccess('Logged Successfully');
          this.router.navigate(['/dashboard']);
        } else {
          this.resetlogin();
          this.notify.showInfo('User not found');
        }
      },
      error: (err: any) => {
        console.error(err);
        this.notify.showInfo('Login failed. Please try again.');
      }
    });
  }

  signup() {
    // Validate required fields
    if (!this.newUser.user_name || !this.newUser.user_id || !this.newUser.pass_wrd) {
      this.notify.showInfo('Please fill in all required fields');
      return;
    }

    // Validate email if provided
    if (this.newUser.email_id && !this.isValidEmail(this.newUser.email_id)) {
      this.notify.showInfo('Please enter a valid email address');
      return;
    }

    // Validate mobile number if provided
    if (this.newUser.mobile_number && !this.isValidMobile(this.newUser.mobile_number)) {
      this.notify.showInfo('Mobile number must be exactly 10 digits');
      return;
    }

    // Validate date of birth if provided
    if (this.newUser.dateofbirth && !this.isValidDOB(this.newUser.dateofbirth)) {
      this.notify.showInfo('Date of birth cannot be in the future');
      return;
    }

    this.loginservice.signup(this.newUser).subscribe({
      next: (res: any) => {
        if (res.message && res.message.toLowerCase().includes('successfully')) {
          this.notify.showSuccess('User created successfully! You can now login.');
          this.closeModal();
          this.resetSignup();
          // Optionally auto-fill username for login
          this.username = this.newUser.user_id;
        } else {
          this.notify.showInfo(res.message || 'Failed to create user');
        }
      },
      error: (err: any) => {
        console.error(err);
        this.notify.showInfo('Error creating user. Please try again.');
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  resetlogin() {
    this.username = '';
    this.password = '';
  }

  resetSignup() {
    this.newUser = {
      user_name: '',
      user_id: '',
      pass_wrd: '',
      dateofbirth: '',
      mobile_number: '',
      email_id: '',
      createdby: 'system'
    };
  }
}

