import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  standalone: false,
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent {
  code = '';
  loading = false;

  constructor(private router: Router) {}

  verify() {
    if (!this.code) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/auth/login']);
    }, 1000);
  }
}

