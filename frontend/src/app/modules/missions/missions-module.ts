import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionsRoutingModule } from './missions-routing-module';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MissionDetailComponent } from './mission-detail/mission-detail.component';
import { SharedModule } from '../../shared/shared-module';
@NgModule({
  declarations: [MissionListComponent, MissionDetailComponent],
  imports: [CommonModule, FormsModule, MissionsRoutingModule, SharedModule]
})
export class MissionsModule {}

