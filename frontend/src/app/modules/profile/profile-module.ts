import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing-module';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SharedModule } from '../../shared/shared-module';
@NgModule({
  declarations: [ProfileViewComponent],
  imports: [CommonModule, FormsModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
