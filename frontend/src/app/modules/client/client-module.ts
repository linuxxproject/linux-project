import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing-module';
import { ClientDashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared-module';
@NgModule({
  declarations: [ClientDashboardComponent],
  imports: [CommonModule, FormsModule, ClientRoutingModule, SharedModule]
})
export class ClientModule {}
