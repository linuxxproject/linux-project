import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  stats = { users: 0, missions: 0, candidatures: 0 };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getStats().subscribe(data => {
      this.stats = data;
    });
  }
}
