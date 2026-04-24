import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MissionService, Mission } from '../../services/mission.service';

@Component({
  selector: 'app-publier-mission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './publier-mission.component.html',
  styleUrl: './publier-mission.component.css'
})
export class PublierMissionComponent {
  missionForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  categories = [
    'Développement Web',
    'Mobile',
    'Design',
    'Marketing',
    'Rédaction',
    'Data Science',
    'DevOps',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private router: Router
  ) {
    this.missionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      categorie: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(1)]],
      date_echeance: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.missionForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const mission: Mission = this.missionForm.value;

    this.missionService.createMission(mission).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Mission publiée avec succès !';
        setTimeout(() => {
          this.router.navigate(['/client/mes-missions']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la publication';
      }
    });
  }

  get titre() { return this.missionForm.get('titre'); }
  get description() { return this.missionForm.get('description'); }
  get categorie() { return this.missionForm.get('categorie'); }
  get budget() { return this.missionForm.get('budget'); }
  get dateEcheance() { return this.missionForm.get('date_echeance'); }
}