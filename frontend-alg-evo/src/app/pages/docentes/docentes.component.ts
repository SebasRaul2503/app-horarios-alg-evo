import { Component, OnInit, ViewChild } from '@angular/core';
import { DocenteService } from '../../core/docente.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface Docente {
  id?: number;
  nombre: string;
  disponibilidad: string;
  disponibilidadArray?: string[];
}

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './docentes.component.html',
  styleUrl: './docentes.component.scss',
})
export class DocentesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  docenteForm: FormGroup;
  dataSource = new MatTableDataSource<Docente>([]);
  displayedColumns: string[] = ['id', 'nombre', 'disponibilidad'];

  isLoading = false;
  isSubmitting = false;

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas = this.generarHoras();
  opcionesDisponibilidad: { value: string; viewValue: string }[] = [];

  constructor(
    private docenteService: DocenteService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.docenteForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      disponibilidad: [
        [],
        [Validators.required, this.maxSelectionValidator(2)],
      ],
    });
  }

  ngOnInit(): void {
    this.generarOpciones();
    this.cargarDocentes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarDocentes(): void {
    this.isLoading = true;
    this.docenteService.getDocentes().subscribe({
      next: (data) => {
        const docentesConArray = data.map((docente) => ({
          ...docente,
          disponibilidadArray: docente.disponibilidad.split(','),
        }));
        this.dataSource.data = docentesConArray;
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los docentes');
        this.isLoading = false;
      },
    });
  }

  agregarDocente(): void {
    if (this.docenteForm.valid) {
      this.isSubmitting = true;

      const formValue = this.docenteForm.value;
      const nuevoDocente: Docente = {
        nombre: formValue.nombre.trim(),
        disponibilidad: formValue.disponibilidad.join(','),
      };

      this.docenteService.addDocente(nuevoDocente).subscribe({
        next: (res) => {
          const docenteConArray = {
            ...res,
            disponibilidadArray: res.disponibilidad.split(','),
          };

          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, docenteConArray];

          this.docenteForm.reset();
          this.mostrarExito('Docente agregado exitosamente');
          this.isSubmitting = false;
        },
        error: (error) => {
          this.mostrarError('Error al agregar el docente');
          this.isSubmitting = false;
        },
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  eliminarDocente(docente: Docente): void {
    this.snackBar.open('Funcion en desarrollo', 'Ok', {
      duration: 4000,
      panelClass: ['confirm-snackbar'],
    });
  }

  generarOpciones(): void {
    this.opcionesDisponibilidad = [];
    this.dias.forEach((dia) => {
      this.horas.forEach((hora) => {
        this.opcionesDisponibilidad.push({
          value: `${dia}-${hora}`,
          viewValue: `${dia} ${hora}`,
        });
      });
    });
  }

  generarHoras(): string[] {
    const horas: string[] = [];
    for (let h = 8; h <= 18; h++) {
      const hh = h.toString().padStart(2, '0');
      horas.push(`${hh}:00`);
    }
    return horas;
  }

  maxSelectionValidator(max: number) {
    return (control: any) => {
      if (control.value && control.value.length > max) {
        return { maxSelection: { max, actual: control.value.length } };
      }
      return null;
    };
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.docenteForm.controls).forEach((key) => {
      this.docenteForm.get(key)?.markAsTouched();
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
    const control = this.docenteForm.get(field);
    if (control?.hasError('required')) {
      return `${
        field === 'nombre' ? 'El nombre' : 'La disponibilidad'
      } es requerida`;
    }
    if (control?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (control?.hasError('maxlength')) {
      return 'El nombre no puede exceder 50 caracteres';
    }
    if (control?.hasError('maxSelection')) {
      return 'Máximo 2 horarios de disponibilidad';
    }
    return '';
  }

  formatearDisponibilidad(disponibilidad: string[]): string {
    return disponibilidad
      .map((d) => {
        const [dia, hora] = d.split('-');
        return `${dia} ${hora}`;
      })
      .join(', ');
  }
}
