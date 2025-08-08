import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CursoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.cursos.findMany();
  }

  async getById(id: number) {
    return this.prismaService.cursos.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    return this.prismaService.cursos.create({
      data: {
        nombre: data.nombre,
        profesor_id: data.profesor_id,
        software_requerido: data.software_requerido,
        peso: data.peso,
        total_alumnos: data.total_alumnos,
        prerequisito_id: data.prerequisito_id,
      },
    });
  }
}
