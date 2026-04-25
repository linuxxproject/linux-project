import { Routes } from '@angular/router';

// Guards
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

// Auth components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

// Client components
import { DashboardComponent } from './client/dashboard/dashboard.component';
import { PublierMissionComponent } from './client/publier-mission/publier-mission.component';
import { MesMissionsComponent } from './client/mes-missions/mes-missions.component';
import { CandidaturesRecuesComponent } from './client/candidatures-recues/candidatures-recues.component';

const clientGuard = roleGuard(['client']);

export const routes: Routes = [
  // Route racine → login directement
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Client protégé
  {
    path: 'client',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [clientGuard] },
      { path: 'publier-mission', component: PublierMissionComponent, canActivate: [clientGuard] },
      { path: 'mes-missions', component: MesMissionsComponent, canActivate: [clientGuard] },
      { path: 'candidatures', component: CandidaturesRecuesComponent, canActivate: [clientGuard] },
    ]
  },

  // Fallback
  { path: '**', redirectTo: '/login' }
];