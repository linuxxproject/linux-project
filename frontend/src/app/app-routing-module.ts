import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'client',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'freelance',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/freelance/freelance-module').then(m => m.FreelanceModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'missions',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/missions/missions-module').then(m => m.MissionsModule)
  },
  {
    path: 'candidature',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/candidature/candidature-module').then(m => m.CandidatureModule)
  },
  {
    path: 'messagerie',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/messagerie/messagerie-module').then(m => m.MessagerieModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/profile/profile-module').then(m => m.ProfileModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}