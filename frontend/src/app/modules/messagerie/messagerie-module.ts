import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagerieRoutingModule } from './messagerie-routing-module';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from '../../shared/shared-module';
@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, FormsModule, MessagerieRoutingModule, SharedModule]
})
export class MessagerieModule {}
