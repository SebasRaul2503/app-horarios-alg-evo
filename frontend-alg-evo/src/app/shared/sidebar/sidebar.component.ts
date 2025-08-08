import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute = '';

  menuItems: MenuItem[] = [
    {
      path: '/docentes',
      label: 'Docentes',
      icon: 'school',
      description: 'Gestión de profesores y disponibilidad',
    },
    {
      path: '/cursos',
      label: 'Cursos',
      icon: 'book',
      description: 'Administración de cursos académicos',
    },
    {
      path: '/laboratorios',
      label: 'Laboratorios',
      icon: 'computer',
      description: 'Gestión de laboratorios y recursos',
    },
    {
      path: '/generar-horario',
      label: 'Generar Horario',
      icon: 'schedule',
      description: 'Creación automática de horarios',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  isActiveRoute(path: string): boolean {
    return (
      this.currentRoute === path || this.currentRoute.startsWith(path + '/')
    );
  }
}
