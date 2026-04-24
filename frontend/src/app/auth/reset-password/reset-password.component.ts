import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading: boolean = false;
  message: string = '';
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    // TODO: Appeler l'API Laravel pour envoyer l'email de reset
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
      this.message = 'Un email de réinitialisation a été envoyé !';
    }, 1500);
  }

  get email() { return this.resetForm.get('email'); }
}