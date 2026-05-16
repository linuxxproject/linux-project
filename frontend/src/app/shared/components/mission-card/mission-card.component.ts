import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mission-card',
  standalone: false,
  templateUrl: './mission-card.component.html',
  styleUrls: ['./mission-card.component.css']
})
export class MissionCardComponent {
  @Input() title: string = '';
  @Input() budget: string = '';
  @Input() status: string = '';
  @Input() meta: string = '';
  @Input() description: string = '';
  @Input() actionLabel: string = '';
  @Input() actionType: 'primary' | 'outline' = 'primary';
  @Output() action = new EventEmitter<void>();

  onAction() {
    this.action.emit();
  }
}

