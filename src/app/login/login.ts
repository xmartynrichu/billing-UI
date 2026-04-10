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
    username: '',
    pwd: ''
   
  };

  constructor(
    private router: Router,
    private loginservice: LoginService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {}

  login() {
    console.log(this.username);
    console.log(this.password);
    if (!this.username || !this.password) {
      this.notify.showInfo('Enter username and password');
      return;
    }

    this.newUser = {
      username: this.username,
      pwd: this.password
    };

    this.loginservice.checkloginuser(this.newUser).subscribe({
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
        this.closeModal();
      },
      error: (err: any) => {
    console.error(err);
  
  }
});
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

resetlogin(){
      this.username='';
      this.password='';
}


}
