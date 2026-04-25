import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  city = '';
  role: 'client' | 'freelance' = 'client';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      city: this.city,
      role: this.role
    };

    this.auth.register(data).subscribe({
      next: (res: any) => {
        this.auth.saveSession(res);
        this.loading = false;

        if (res.role === 'client') {
          this.router.navigate(['/client']);
        } else {
          this.router.navigate(['/freelance']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l’inscription';
      }
    });
  }
}