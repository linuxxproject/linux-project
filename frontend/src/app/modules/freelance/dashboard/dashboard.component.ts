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
  availableMissions: any[] = [];
  myApplications: any[] = [];

  stats = [
    { label: 'Candidatures envoyées', value: 0, sub: 'total' },
    { label: 'Acceptées', value: 0, sub: 'gagnées', color: '#059669' },
    { label: 'En attente', value: 0, sub: 'en cours', color: '#d97706' },
    { label: 'Missions ouvertes', value: 0, sub: 'disponibles' }
  ];

  constructor(
    private auth: AuthService,
    private missionService: MissionService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();

    this.auth.me().subscribe({
      next: (user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    });

    this.loadMissions();
    this.loadApplications();
  }

  loadMissions(): void {
    this.missionService.getAll().subscribe({
      next: (res: any) => {
        const allMissions = res.data || res;
        this.availableMissions = allMissions.filter((m: any) => m.status === 'ouverte');
        this.stats[3].value = this.availableMissions.length;
      }
    });
  }

  loadApplications(): void {
    this.applicationService.getMine().subscribe({
      next: (res: any) => {
        this.myApplications = res || [];
        this.stats[0].value = this.myApplications.length;
        this.stats[1].value = this.myApplications.filter((a: any) => a.status === 'acceptee').length;
        this.stats[2].value = this.myApplications.filter((a: any) => a.status === 'en_attente').length;
      }
    });
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