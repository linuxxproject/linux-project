import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  stats = {
    missionsTotal: 0,
    missionsOuvertes: 0,
    candidaturesRecues: 0
  };

  constructor(
    private authService: AuthService,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.missionService.getMesMissions().subscribe({
      next: (missions) => {
        this.stats.missionsTotal = missions.length;
        this.stats.missionsOuvertes = missions.filter((m: any) => m.statut === 'ouverte').length;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}