import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  error = '';
  success = '';
  sent = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  send() {
    if (!this.email) {
      this.error = 'Veuillez entrer votre email';
      return;
    }

    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Email invalide';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.sent = true;
        this.success = res.message || 'Vérifiez votre email pour le lien de réinitialisation';
        this.email = '';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Une erreur est survenue lors de la demande';
      }
    });
  }
}

