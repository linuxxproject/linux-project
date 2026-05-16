import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-mes-missions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mes-missions.component.html',
  styleUrl: './mes-missions.component.css'
})
export class MesMissionsComponent implements OnInit {
  missions: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.missionService.getMesMissions().subscribe({
      next: (data) => {
        this.missions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des missions';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'ouverte': 'status-ouverte',
      'en_cours': 'status-en-cours',
      'terminee': 'status-terminee',
      'annulee': 'status-annulee'
    };
    return classes[statut] || '';
  }

  deleteMission(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette mission ?')) {
      this.missionService.deleteMission(id).subscribe({
        next: () => {
          this.missions = this.missions.filter(m => m.id !== id);
        },
        error: () => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}