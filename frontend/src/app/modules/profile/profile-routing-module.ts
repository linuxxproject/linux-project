import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { LogoutConfirmComponent } from './logout-confirm/logout-confirm.component';

const routes: Routes = [
  { path: '', component: ProfileViewComponent },
  { path: 'logout-confirm', component: LogoutConfirmComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
