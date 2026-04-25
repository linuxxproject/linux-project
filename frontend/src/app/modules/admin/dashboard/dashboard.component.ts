import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = [
    { label: 'Utilisateurs', value: 0, sub: '...' },
    { label: 'Missions publiées', value: 0, sub: '...', color: '#059669' },
    { label: 'Candidatures', value: 0, sub: 'total', color: '#d97706' },
    { label: 'Terminées', value: 0, sub: 'complétées', color: '#5b21b6' }
  ];

  users: any[] = [];
  chartMonths: any[] = [];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadMonthly();
  }

  loadStats(): void {
    this.statsService.getStats().subscribe({
      next: (res: any) => {
        this.stats[0].value = res.users?.total || 0;
        this.stats[0].sub = '+' + (res.users?.new_this_month || 0) + ' ce mois';
        this.stats[1].value = res.missions?.total || 0;
        this.stats[1].sub = '+' + (res.missions?.open || 0) + ' ouvertes';
        this.stats[2].value = res.applications?.total || 0;
        this.stats[2].sub = 'total';
        this.stats[3].value = res.missions?.closed || 0;
        this.stats[3].sub = 'complétées';
      }
    });
  }

  loadUsers(): void {
    this.statsService.getRecentUsers().subscribe({
      next: (res: any) => {
        this.users = (res || []).slice(0, 4).map((u: any) => ({
          initials: this.getInitials(u.name),
          name: u.name,
          role: u.role === 'client' ? 'Client' : u.role === 'freelance' ? 'Freelance' : 'Admin',
          status: u.is_active ? 'Actif' : 'Inactif'
        }));
      }
    });
  }

  loadMonthly(): void {
    this.statsService.getMonthlyActivity().subscribe({
      next: (res: any) => {
        const data = res || [];
        const max = Math.max(...data.map((m: any) => m.missions || 0), 1);
        const colors = ['#bfdbfe', '#93c5fd', '#93c5fd', '#3b82f6', '#3b82f6', '#1a56db'];
        this.chartMonths = data.map((m: any, i: number) => ({
          label: m.month,
          height: Math.round(((m.missions || 0) / max) * 80),
          color: colors[i] || '#3b82f6'
        }));
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}

