import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionListComponent } from './mission-list/mission-list.component';

import { MissionDetailComponent } from './mission-detail/mission-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MissionListComponent
  },
  
  {
    path: ':id',
    component: MissionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionsRoutingModule {}