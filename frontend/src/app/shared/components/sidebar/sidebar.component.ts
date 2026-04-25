import { Component, Input } from '@angular/core';

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
export class SidebarComponent {
  @Input() role: string = '';
  @Input() activeRoute: string = '';

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
}
