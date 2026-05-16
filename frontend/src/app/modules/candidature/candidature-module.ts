import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidatureRoutingModule } from './candidature-routing-module';
import { CandidatureTrackerComponent } from './candidature-tracker/candidature-tracker.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    CandidatureTrackerComponent
  ],
  imports: [
    CommonModule,
    CandidatureRoutingModule,
    SharedModule
  ]
})
export class CandidatureModule {}