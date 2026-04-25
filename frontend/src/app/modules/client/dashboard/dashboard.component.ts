import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MissionService } from '../../../core/services/mission.service';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;

  stats = [
    { label: 'Missions publiées', value: 0, sub: 'total' },
    { label: 'En cours', value: 0, sub: 'actives', color: '#059669' },
    { label: 'Candidatures reçues', value: 0, sub: 'à traiter', color: '#d97706' },
    { label: 'Terminées', value: 0, sub: 'complétées' }
  ];

  missions: any[] = [];

  constructor(
    private auth: AuthService,
    private missionService: MissionService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.loadData();
  }

  loadData(): void {
    this.missionService.getMyMissions().subscribe({
      next: (res: any) => {
        this.missions = res || [];
        this.stats[0].value = this.missions.length;
        this.stats[1].value = this.missions.filter((m: any) => m.status === 'en_cours').length;
        this.stats[3].value = this.missions.filter((m: any) => m.status === 'fermee').length;
      }
    });

    this.applicationService.getAll().subscribe({
      next: (res: any) => {
        const apps = res || [];
        this.stats[2].value = apps.length;
      }
    });
  }

  formatStatus(status: string): string {
    if (status === 'ouverte') return 'Ouverte';
    if (status === 'en_cours') return 'En cours';
    if (status === 'fermee') return 'Fermée';
    return status;
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'aujourd\'hui';
    if (diff === 1) return 'hier';
    return 'il y a ' + diff + ' jours';
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
}
