import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { HorarioService } from '../../core/horario.service';

interface HorarioItem {
  curso: string;
  dia: string;
  hora: string;
  laboratorio: string;
  profesor: string;
}

interface HorarioCell {
  cursos: HorarioItem[];
  isEmpty: boolean;
  hasMultiple: boolean;
}

@Component({
  selector: 'app-generar-horario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatMenuModule,
  ],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.scss',
})
export class HorarioComponent implements OnInit {
  isLoading = false;
  hasHorario = false;
  horarioData: HorarioItem[] = [];
  horarioGrid: { [key: string]: HorarioCell } = {};

  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']; // Sin tilde en Miércoles
  horas = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  estadisticas = {
    totalCursos: 0,
    profesoresActivos: 0,
    laboratoriosUsados: 0,
    horasOcupadas: 0,
    conflictos: 0,
  };

  constructor(
    private horarioService: HorarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inicializarGrid();
  }

  inicializarGrid(): void {
    this.horarioGrid = {};
    this.dias.forEach((dia) => {
      this.horas.forEach((hora) => {
        const key = `${dia}-${hora}`;
        this.horarioGrid[key] = {
          cursos: [],
          isEmpty: true,
          hasMultiple: false,
        };
      });
    });
  }

  generarHorario(): void {
    this.isLoading = true;
    this.hasHorario = false;
    this.inicializarGrid();

    this.horarioService.getHorarios().subscribe({
      next: (data: HorarioItem[]) => {
        this.horarioData = data;
        this.procesarHorario(data);
        this.calcularEstadisticas(data);
        this.hasHorario = true;
        this.isLoading = false;
        this.mostrarExito('¡Horario generado exitosamente!');
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarError('Error al generar el horario. Intente nuevamente.');
        console.error('Error:', error);
      },
    });
  }

  procesarHorario(data: HorarioItem[]): void {
    // Agrupar cursos por día-hora
    const agrupados: { [key: string]: HorarioItem[] } = {};

    data.forEach((item) => {
      const key = `${item.dia}-${item.hora}`;
      if (!agrupados[key]) {
        agrupados[key] = [];
      }
      agrupados[key].push(item);
    });

    // Llenar el grid con los cursos agrupados
    Object.keys(agrupados).forEach((key) => {
      if (this.horarioGrid[key]) {
        const cursos = agrupados[key];
        this.horarioGrid[key] = {
          cursos: cursos,
          isEmpty: false,
          hasMultiple: cursos.length > 1,
        };
      }
    });
  }

  calcularEstadisticas(data: HorarioItem[]): void {
    this.estadisticas.totalCursos = data.length;
    this.estadisticas.profesoresActivos = new Set(
      data.map((item) => item.profesor)
    ).size;
    this.estadisticas.laboratoriosUsados = new Set(
      data.map((item) => item.laboratorio)
    ).size;

    // Contar horas ocupadas (slots únicos)
    const slotsOcupados = new Set(
      data.map((item) => `${item.dia}-${item.hora}`)
    );
    this.estadisticas.horasOcupadas = slotsOcupados.size;

    // Contar conflictos (múltiples cursos en la misma hora)
    this.estadisticas.conflictos = Object.values(this.horarioGrid).filter(
      (cell) => cell.hasMultiple
    ).length;
  }

  getCellData(dia: string, hora: string): HorarioCell {
    const key = `${dia}-${hora}`;
    return (
      this.horarioGrid[key] || { cursos: [], isEmpty: true, hasMultiple: false }
    );
  }

  getLaboratorioColor(laboratorio: string): string {
    const colors = [
      '#e3f2fd',
      '#f3e5f5',
      '#e8f5e8',
      '#fff3e0',
      '#fce4ec',
      '#e0f2f1',
      '#f1f8e9',
      '#fff8e1',
      '#e8eaf6',
      '#fafafa',
    ];
    const hash = laboratorio.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }

  getMultipleCursosColor(): string {
    return '#fff3e0'; // Color especial para celdas con múltiples cursos
  }

  reiniciarHorario(): void {
    this.hasHorario = false;
    this.horarioData = [];
    this.inicializarGrid();
    this.estadisticas = {
      totalCursos: 0,
      profesoresActivos: 0,
      laboratoriosUsados: 0,
      horasOcupadas: 0,
      conflictos: 0,
    };
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      panelClass: ['error-snackbar'],
    });
  }
}
