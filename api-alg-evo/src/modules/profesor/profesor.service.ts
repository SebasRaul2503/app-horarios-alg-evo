import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfesorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.profesores.findMany();
  }

  async getById(id: number) {
    return this.prismaService.profesores.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    return this.prismaService.profesores.create({
      data: {
        nombre: data.nombre,
        disponibilidad: data.disponibilidad,
      },
    });
  }
}
