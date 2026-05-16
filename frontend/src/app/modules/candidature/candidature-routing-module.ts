import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CandidatureTrackerComponent } from './candidature-tracker/candidature-tracker.component';

const routes: Routes = [
  {
    path: '',
    component: CandidatureTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatureRoutingModule {}