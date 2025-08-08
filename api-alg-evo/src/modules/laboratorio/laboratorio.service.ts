import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LaboratorioService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.laboratorios.findMany();
  }

  async getById(id: number) {
    return this.prismaService.laboratorios.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    return this.prismaService.laboratorios.create({
      data: {
        nombre: data.nombre,
        capacidad: data.capacidad,
        software: data.software,
      },
    });
  }
}
