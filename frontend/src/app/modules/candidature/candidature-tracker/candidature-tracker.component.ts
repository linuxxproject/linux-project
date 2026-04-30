import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-candidature-tracker',
  standalone: false,
  templateUrl: './candidature-tracker.component.html',
  styleUrls: ['./candidature-tracker.component.css']
})
export class CandidatureTrackerComponent implements OnInit {
  role = localStorage.getItem('role') || 'client';
  user: any = null;

  filter = 'all';
  candidatures: any[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.loading = true;

    this.applicationService.getMine().subscribe({
      next: (res: any) => {
        this.candidatures = res || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des candidatures.';
        this.loading = false;
      }
    });
  }

  get filtered() {
    if (this.filter === 'all') return this.candidatures;

    return this.candidatures.filter(c => {
      if (this.filter === 'pending') return c.status === 'en_attente';
      if (this.filter === 'accepted') return c.status === 'acceptee';
      if (this.filter === 'rejected') return c.status === 'refusee';
      return true;
    });
  }

  countByStatus(status: string): number {
    return this.candidatures.filter(c => c.status === status).length;
  }

  formatStatus(status: string): string {
    if (status === 'en_attente') return 'En attente';
    if (status === 'acceptee') return 'Acceptée';
    if (status === 'refusee') return 'Refusée';
    return status;
  }

  initials(): string {
    if (!this.user?.name) return 'U';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  viewMission(id: number): void {
    if (id) {
      this.router.navigate(['/missions', id]);
    }
  }

  accept(id: number): void {
    this.applicationService.updateStatus(id, 'acceptee').subscribe({
      next: () => this.loadCandidatures(),
      error: () => alert('Erreur lors de l\'acceptation.')
    });
  }

  reject(id: number): void {
    this.applicationService.updateStatus(id, 'refusee').subscribe({
      next: () => this.loadCandidatures(),
      error: () => alert('Erreur lors du refus.')
    });
  }
}

