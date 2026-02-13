import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  handleMenuClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('a') || target.closest('button.menu-item')) {
      if (window.innerWidth <= 768) {
        this.closeSidebar();
      }
    }
  }
}
