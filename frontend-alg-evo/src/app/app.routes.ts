import { Routes } from '@angular/router';
import { DocentesComponent } from './pages/docentes/docentes.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { HorarioComponent } from './pages/horario/horario.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'docentes',
        pathMatch: 'full',
      },
      {
        path: 'docentes',
        component: DocentesComponent,
        title: 'Docentes',
      },
      {
        path: 'cursos',
        component: CursosComponent,
        title: 'Cursos',
      },
      {
        path: 'laboratorios',
        component: LaboratoriosComponent,
        title: 'Laboratorios',
      },
      {
        path: 'generar-horario',
        component: HorarioComponent,
        title: 'Generar Horario',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
