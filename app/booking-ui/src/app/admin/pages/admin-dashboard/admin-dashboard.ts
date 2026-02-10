import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService, AdminStats } from '@core/services/admin/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<AdminStats | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
    });
  }
}
