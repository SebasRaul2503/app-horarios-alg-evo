import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LaboratorioService } from './laboratorio.service';

@Controller('laboratorio')
export class LaboratorioController {
  constructor(private readonly laboratorioService: LaboratorioService) {}

  @Get()
  getAll() {
    return this.laboratorioService.getAll();
  }
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.laboratorioService.getById(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.laboratorioService.create(data);
  }
}
