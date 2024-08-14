import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ScrollTopModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrl: './dashboard-navbar.component.scss',
})
export class DashboardNavbarComponent implements OnInit {
  sidebarVisible = true;
  showClass = 'sidebar-close';
  width = 0;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    if (this.width >= 768) {
      this.showClass = this.sidebarVisible ? 'sidebar-open' : 'sidebar-close';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.width = window.innerWidth;
    this.sidebarVisible = this.width >= 768;
    if (this.sidebarVisible) {
      this.showClass = 'sidebar-open';
    }
  }
}
