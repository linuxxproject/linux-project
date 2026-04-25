import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionService } from '../../../core/services/mission.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mission-list',
  standalone: false,
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  role = localStorage.getItem('role') || 'client';
  user: any = null;

  filter = 'all';
  search = '';
  missions: any[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private missionService: MissionService,
    private applicationService: ApplicationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.loadMissions();
  }

  loadMissions(): void {
    this.loading = true;

    this.missionService.getAll().subscribe({
      next: (res: any) => {
        this.missions = res.data || res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des missions.';
        this.loading = false;
      }
    });
  }

  get filteredMissions() {
    let list = this.missions;

    if (this.filter !== 'all') {
      list = list.filter(m => {
        if (this.filter === 'open') return m.status === 'ouverte';
        if (this.filter === 'inprogress') return m.status === 'en_cours';
        if (this.filter === 'closed') return m.status === 'fermee';
        return true;
      });
    }

    if (this.search) {
      list = list.filter(m =>
        m.title?.toLowerCase().includes(this.search.toLowerCase()) ||
        m.description?.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    return list;
  }

  countByStatus(status: string): number {
    return this.missions.filter(m => m.status === status).length;
  }

  formatStatus(status: string): string {
    if (status === 'ouverte') return 'Ouverte';
    if (status === 'en_cours') return 'En cours';
    if (status === 'fermee') return 'Fermée';
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

  view(id: number): void {
    this.router.navigate(['/missions', id]);
  }

  apply(id: number): void {
    this.applicationService.apply(id, 'Je suis intéressé par cette mission.').subscribe({
      next: () => {
        alert('Candidature envoyée avec succès.');
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de l’envoi de la candidature.');
      }
    });
  }
}