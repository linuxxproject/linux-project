import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  sent = false;
  loading = false;

  constructor(private router: Router) {}

  send() {
    if (!this.email) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.sent = true;
    }, 1000);
  }
}

