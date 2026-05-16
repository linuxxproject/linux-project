import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MissionService } from '../../../core/services/mission.service';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  user: any = null;
  showMissionModal = false;
  savingMission = false;
  deletingMissionId: number | null = null;
  editingMissionId: number | null = null;
  missionError = '';

  newMission = {
    title: '',
    description: '',
    budget: null as number | null,
    skillsText: '',
    deadline: ''
  };

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

  openMissionModal(): void {
    this.editingMissionId = null;
    this.showMissionModal = true;
    this.missionError = '';
  }

  openEditMissionModal(mission: any): void {
    this.editingMissionId = mission.id;
    this.missionError = '';
    this.newMission = {
      title: mission.title || '',
      description: mission.description || '',
      budget: mission.budget ?? null,
      skillsText: Array.isArray(mission.skills) ? mission.skills.join(', ') : '',
      deadline: mission.deadline ? String(mission.deadline).slice(0, 10) : ''
    };
    this.showMissionModal = true;
  }

  closeMissionModal(): void {
    if (this.savingMission) return;
    this.showMissionModal = false;
    this.resetMissionForm();
  }

  saveMission(): void {
    if (!this.newMission.title || !this.newMission.description || !this.newMission.budget) {
      this.missionError = 'Veuillez remplir le titre, la description et le budget.';
      return;
    }

    this.savingMission = true;
    this.missionError = '';

    const payload = {
      title: this.newMission.title,
      description: this.newMission.description,
      budget: this.newMission.budget,
      deadline: this.newMission.deadline || null,
      skills: this.newMission.skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    };

    const request$ = this.editingMissionId
      ? this.missionService.update(this.editingMissionId, payload)
      : this.missionService.create(payload);

    request$.subscribe({
      next: () => {
        this.savingMission = false;
        this.showMissionModal = false;
        this.resetMissionForm();
        this.loadData();
      },
      error: (err) => {
        this.savingMission = false;
        const validationErrors = err.error?.errors;
        this.missionError = validationErrors
          ? Object.values(validationErrors).flat().join(' ')
          : err.error?.message || 'Erreur lors de l\'enregistrement de la mission.';
      }
    });
  }

  createMission(): void {
    this.saveMission();
  }

  deleteMission(mission: any): void {
    if (!mission?.id || this.deletingMissionId) return;

    const confirmed = confirm(`Supprimer la mission "${mission.title}" ?`);
    if (!confirmed) return;

    this.deletingMissionId = mission.id;

    this.missionService.delete(mission.id).subscribe({
      next: () => {
        this.deletingMissionId = null;
        this.loadData();
      },
      error: (err) => {
        this.deletingMissionId = null;
        alert(err.error?.message || 'Erreur lors de la suppression de la mission.');
      }
    });
  }

  private resetMissionForm(): void {
    this.editingMissionId = null;
    this.newMission = {
      title: '',
      description: '',
      budget: null,
      skillsText: '',
      deadline: ''
    };
  }
}

