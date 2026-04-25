import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from '../../../core/services/mission.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-mission-detail',
  standalone: false,
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  mission: any = null;
  role = '';
  user: any = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private missionService: MissionService,
    private applicationService: ApplicationService,
    private messageService: MessageService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.role = this.auth.getRole();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMission(id);
    }
  }

  loadMission(id: number): void {
    this.loading = true;
    this.missionService.getById(id).subscribe({
      next: (res: any) => {
        this.mission = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement de la mission.';
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  apply(): void {
    if (!this.mission) return;
    this.applicationService.apply(this.mission.id, 'Je suis intéressé par cette mission.').subscribe({
      next: () => {
        alert('Candidature envoyée avec succès.');
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de l\'envoi de la candidature.');
      }
    });
  }

  contact(): void {
    if (!this.mission?.client?.id) return;
    this.messageService.startConversation(this.mission.client.id, 'Bonjour, je suis intéressé par votre mission : ' + this.mission.title).subscribe({
      next: () => {
        this.router.navigate(['/messagerie']);
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de l\'envoi du message.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/missions']);
  }
}
