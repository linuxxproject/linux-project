import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(id: number) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  changeRole(id: number, role: string) {
    this.adminService.changeRole(id, role).subscribe(() => this.loadUsers());
  }
}
