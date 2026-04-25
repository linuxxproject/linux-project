import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing-module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared-module';
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, ClientRoutingModule, SharedModule]
})
export class ClientModule {}
