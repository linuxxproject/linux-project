import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.saveSession(res);
        this.loading = false;

        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (res.role === 'client') {
          this.router.navigate(['/client']);
        } else {
          this.router.navigate(['/freelance']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}