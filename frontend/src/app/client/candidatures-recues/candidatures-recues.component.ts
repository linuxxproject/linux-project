import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-candidatures-recues',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidatures-recues.component.html',
  styleUrl: './candidatures-recues.component.css'
})
export class CandidaturesRecuesComponent implements OnInit {
  missions: any[] = [];
  selectedMissionId: number | null = null;
  candidatures: any[] = [];
  isLoading: boolean = true;

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
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadCandidatures(missionId: number): void {
    this.selectedMissionId = missionId;
    this.missionService.getCandidatures(missionId).subscribe({
      next: (data) => {
        this.candidatures = data;
      }
    });
  }

  accepterCandidature(candidatureId: number): void {
    // TODO: Appeler API pour accepter
    alert('Candidature acceptée !');
  }

  refuserCandidature(candidatureId: number): void {
    // TODO: Appeler API pour refuser
    alert('Candidature refusée');
  }
}