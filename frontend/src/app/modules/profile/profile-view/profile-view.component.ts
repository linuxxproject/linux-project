import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
})
export class ProfileViewComponent implements OnInit {
  role = localStorage.getItem('role') || 'freelance';
  user: any = {
    name: '',
    email: '',
    phone: '',
    city: '',
    role: '',
    bio: '',
    skills: [],
  };

  editing = false;
  passwordData = { oldPassword: '', newPassword: '' };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser() || this.user;

    this.auth.me().subscribe({
      next: (user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      },
    });
  }

  get roleLabel(): string {
    if (this.user.role === 'client') return 'Client';
    if (this.user.role === 'freelance') return 'Freelance';
    if (this.user.role === 'admin') return 'Admin';
    return this.user.role;
  }

  get profileCompletion(): number {
    let fields = 0;
    let total = 5;

    if (this.user.name) fields++;
    if (this.user.email) fields++;
    if (this.user.phone) fields++;
    if (this.user.city) fields++;
    if (this.user.bio) fields++;

    return Math.round((fields / total) * 100);
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatRole(role: string): string {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  }

  save(): void {
    this.auth
      .updateProfile({
        name: this.user.name,
        phone: this.user.phone,
        city: this.user.city,
        bio: this.user.bio,
      })
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          alert('Profil mis à jour avec succès.');
        },
        error: (err) => {
          alert('Erreur lors de la mise à jour : ' + (err.error?.message || err.message));
        },
      });
  }

  changePassword(): void {
    if (!this.passwordData.newPassword || this.passwordData.newPassword.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    alert('Mot de passe modifié avec succès (simulation).');
    this.passwordData = { oldPassword: '', newPassword: '' };
  }
}
