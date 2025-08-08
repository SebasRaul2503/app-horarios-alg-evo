import { Component, OnInit, ViewChild } from '@angular/core';
import { LaboratoriosService } from '../../core/laboratorios.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
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

interface Laboratorio {
  id?: number;
  nombre: string;
  capacidad: number;
  software: string;
  softwareArray?: string[];
}

@Component({
  selector: 'app-laboratorios',
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
  templateUrl: './laboratorios.component.html',
  styleUrl: './laboratorios.component.scss',
})
export class LaboratoriosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  laboratorioForm: FormGroup;
  dataSource = new MatTableDataSource<Laboratorio>([]);
  displayedColumns = ['id', 'nombre', 'capacidad', 'software'];

  isLoading = false;
  isSubmitting = false;

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

  constructor(
    private fb: FormBuilder,
    private laboratoriosService: LaboratoriosService,
    private snackBar: MatSnackBar
  ) {
    this.laboratorioForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      capacidad: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      software: [[], [Validators.required, this.minSelectionValidator(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarLaboratorios(): void {
    this.isLoading = true;
    this.laboratoriosService.getLaboratorios().subscribe({
      next: (labs) => {
        const laboratoriosConArray = labs.map((lab) => ({
          ...lab,
          softwareArray: lab.software
            .split(';')
            .filter((s: string) => s.trim() !== ''),
        }));
        this.dataSource.data = laboratoriosConArray;
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los laboratorios');
        this.isLoading = false;
      },
    });
  }

  agregarLaboratorio(): void {
    if (this.laboratorioForm.valid) {
      this.isSubmitting = true;

      const formValue = this.laboratorioForm.value;
      const softwareSeleccionado = this.laboratorioForm.get('software')
        ?.value as string[] | undefined;

      const nuevoLab: Laboratorio = {
        nombre: formValue.nombre?.trim() ?? '',
        capacidad: formValue.capacidad ?? 0,
        software: softwareSeleccionado ? softwareSeleccionado.join(';') : '',
      };

      this.laboratoriosService.addLaboratorio(nuevoLab).subscribe({
        next: (labCreado) => {
          const labConArray = {
            ...labCreado,
            softwareArray: labCreado.software
              .split(';')
              .filter((s: string) => s.trim() !== ''),
          };

          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, labConArray];

          this.laboratorioForm.reset();
          this.mostrarExito('Laboratorio agregado exitosamente');
          this.isSubmitting = false;
        },
        error: (error) => {
          this.mostrarError('Error al agregar el laboratorio');
          this.isSubmitting = false;
        },
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  getSoftwareIcon(software: string): string {
    const softwareInfo = this.softwareDisponibles.find(
      (s) => s.value === software
    );
    return softwareInfo?.icon || 'code';
  }

  getSoftwareColor(software: string): string {
    const softwareInfo = this.softwareDisponibles.find(
      (s) => s.value === software
    );
    return softwareInfo?.color || '#666';
  }

  getCapacidadColor(capacidad: number): string {
    if (capacidad <= 20) return 'warn';
    if (capacidad <= 40) return 'accent';
    return 'primary';
  }

  getCapacidadIcon(capacidad: number): string {
    if (capacidad <= 20) return 'group';
    if (capacidad <= 40) return 'groups';
    return 'groups_3';
  }

  minSelectionValidator(min: number) {
    return (control: any) => {
      if (!control.value || control.value.length < min) {
        return { minSelection: { min, actual: control.value?.length || 0 } };
      }
      return null;
    };
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.laboratorioForm.controls).forEach((key) => {
      this.laboratorioForm.get(key)?.markAsTouched();
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
    const control = this.laboratorioForm.get(field);

    if (control?.hasError('required')) {
      const fieldNames: { [key: string]: string } = {
        nombre: 'El nombre',
        capacidad: 'La capacidad',
        software: 'El software',
      };
      return `${fieldNames[field]} es requerido`;
    }

    if (control?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres';
    }

    if (control?.hasError('maxlength')) {
      return 'El nombre no puede exceder 50 caracteres';
    }

    if (control?.hasError('min')) {
      return 'La capacidad debe ser mayor a 0';
    }

    if (control?.hasError('max')) {
      return 'La capacidad no puede exceder 100 estudiantes';
    }

    if (control?.hasError('minSelection')) {
      return 'Debe seleccionar al menos un software';
    }

    return '';
  }
}
