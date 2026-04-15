import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../service/login.service';
import { NotificationService } from '../common/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        console.log(res);
        if (res.message == 'Success') {
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

    this.loginservice.signup(this.newUser).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.message === 'Success') {
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

