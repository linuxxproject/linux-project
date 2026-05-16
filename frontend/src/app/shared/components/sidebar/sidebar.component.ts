import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() role: string = '';
  @Input() activeRoute: string = '';
  unreadMessages = 0;

  private unreadTimer?: ReturnType<typeof setInterval>;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadUnreadMessages();
    this.unreadTimer = setInterval(() => this.loadUnreadMessages(), 15000);
  }

  ngOnDestroy(): void {
    if (this.unreadTimer) {
      clearInterval(this.unreadTimer);
    }
  }

  get items(): NavItem[] {
    return [
      {
        label: 'Dashboard',
        route: this.role === 'freelance' ? '/freelance' : this.role === 'admin' ? '/admin' : '/client',
        icon: 'dashboard'
      },
      {
        label: 'Missions',
        route: '/missions',
        icon: 'missions'
      },
      {
        label: 'Candidatures',
        route: '/candidature',
        icon: 'candidatures'
      },
      {
        label: 'Messagerie',
        route: '/messagerie',
        icon: 'messagerie'
      },
      {
        label: 'Profil',
        route: '/profile',
        icon: 'profil'
      },
      {
        label: 'Déconnexion',
        route: '/profile/logout-confirm',
        icon: 'logout'
      }
    ];
  }

  isActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  private loadUnreadMessages(): void {
    this.messageService.getConversations().subscribe({
      next: (conversations: any[]) => {
        this.unreadMessages = (conversations || []).reduce(
          (total, conversation) => total + Number(conversation.unread_count || 0),
          0
        );
      },
      error: () => {
        this.unreadMessages = 0;
      }
    });
  }
}
