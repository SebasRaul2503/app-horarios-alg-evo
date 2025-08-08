import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';
import { DocenteService } from '../../core/docente.service';
import { CursoService } from '../../core/curso.service';

interface Docente {
  id: number;
  nombre: string;
}

interface Curso {
  id?: number;
  nombre: string;
  profesor_id: number;
  software_requerido: string;
  peso: number;
  total_alumnos: number;
  prerequisito_id?: number | null;
  profesorNombre?: string;
  prerequisitoNombre?: string | null;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
  ],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss',
})
export class CursosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cursoForm: FormGroup;
  dataSource = new MatTableDataSource<Curso>([]);
  displayedColumns = [
    'id',
    'nombre',
    'profesor',
    'software_requerido',
    'peso',
    'total_alumnos',
    'prerequisito',
  ];

  isLoading = false;
  isSubmitting = false;
  isLoadingDocentes = false;

  softwareDisponibles = [
    { value: 'Java', icon: 'code', color: '#f89820' },
    { value: 'Python', icon: 'smart_toy', color: '#3776ab' },
    { value: 'Node', icon: 'javascript', color: '#68a063' },
    { value: 'MySQL', icon: 'storage', color: '#00758f' },
    { value: 'R', icon: 'analytics', color: '#276dc3' },
    { value: 'SQLServer', icon: 'database', color: '#cc2927' },
    { value: 'C++', icon: 'code', color: '#00599c' },
    { value: 'C#', icon: 'code', color: '#239120' },
  ];

  docentes: Docente[] = [];
  cursos: Curso[] = [];

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private cursoService: CursoService,
    private snackBar: MatSnackBar
  ) {
    this.cursoForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      profesor_id: [null, Validators.required],
      software_requerido: ['', Validators.required],
      peso: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      total_alumnos: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      prerequisito_id: [null],
    });
  }

  ngOnInit(): void {
    this.cargarDocentes();
    this.cargarCursos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarDocentes(): void {
    this.isLoadingDocentes = true;
    this.docenteService.getDocentes().subscribe({
      next: (data) => {
        this.docentes = data;
        this.isLoadingDocentes = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los docentes');
        this.isLoadingDocentes = false;
      },
    });
  }

  cargarCursos(): void {
    this.isLoading = true;
    this.cursoService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.dataSource.data = this.procesarCursos(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los cursos');
        this.isLoading = false;
      },
    });
  }

  procesarCursos(cursos: Curso[]): Curso[] {
    return cursos.map((curso) => ({
      ...curso,
      profesorNombre: this.obtenerNombreDocente(curso.profesor_id),
      prerequisitoNombre: this.obtenerNombreCurso(curso.prerequisito_id),
    }));
  }

  agregarCurso(): void {
    if (this.cursoForm.valid) {
      this.isSubmitting = true;

      const formValue = this.cursoForm.value;
      const nuevoCurso: Curso = {
        nombre: formValue.nombre.trim(),
        profesor_id: formValue.profesor_id,
        software_requerido: formValue.software_requerido,
        peso: formValue.peso,
        total_alumnos: formValue.total_alumnos,
        prerequisito_id: formValue.prerequisito_id || null,
      };

      this.cursoService.addCurso(nuevoCurso).subscribe({
        next: (cursoCreado) => {
          this.cursos.push(cursoCreado);
          this.dataSource.data = this.procesarCursos(this.cursos);

          this.cursoForm.reset();
          this.mostrarExito('Curso agregado exitosamente');
          this.isSubmitting = false;
        },
        error: (error) => {
          this.mostrarError('Error al agregar el curso');
          this.isSubmitting = false;
        },
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  obtenerNombreDocente(id: number): string {
    return this.docentes.find((d) => d.id === id)?.nombre || 'Desconocido';
  }

  obtenerNombreCurso(id?: number | null): string | null {
    if (!id) return null;
    return this.cursos.find((c) => c.id === id)?.nombre || null;
  }

  getSoftwareInfo(software: string) {
    return (
      this.softwareDisponibles.find((s) => s.value === software) || {
        value: software,
        icon: 'code',
        color: '#666',
      }
    );
  }

  getPesoColor(peso: number): string {
    if (peso <= 3) return 'primary';
    if (peso <= 6) return 'accent';
    return 'warn';
  }

  getPesoIcon(peso: number): string {
    if (peso <= 3) return 'star_border';
    if (peso <= 6) return 'star_half';
    return 'star';
  }

  getAlumnosColor(alumnos: number): string {
    if (alumnos <= 20) return 'primary';
    if (alumnos <= 40) return 'accent';
    return 'warn';
  }

  getCursosDisponiblesParaPrerequisito(): Curso[] {
    return this.cursos.filter(
      (curso) => curso.id !== this.cursoForm.get('id')?.value
    );
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.cursoForm.controls).forEach((key) => {
      this.cursoForm.get(key)?.markAsTouched();
    });
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

  getErrorMessage(field: string): string {
    const control = this.cursoForm.get(field);

    if (control?.hasError('required')) {
      const fieldNames: { [key: string]: string } = {
        nombre: 'El nombre',
        profesor_id: 'El profesor',
        software_requerido: 'El software requerido',
        peso: 'El peso',
        total_alumnos: 'El total de alumnos',
      };
      return `${fieldNames[field]} es requerido`;
    }

    if (control?.hasError('minlength')) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (control?.hasError('maxlength')) {
      return 'El nombre no puede exceder 100 caracteres';
    }

    if (control?.hasError('min')) {
      if (field === 'peso') return 'El peso debe ser mayor a 0';
      if (field === 'total_alumnos') return 'Debe haber al menos 1 alumno';
    }

    if (control?.hasError('max')) {
      if (field === 'peso') return 'El peso no puede exceder 10';
      if (field === 'total_alumnos') return 'No puede exceder 100 alumnos';
    }

    return '';
  }
}
