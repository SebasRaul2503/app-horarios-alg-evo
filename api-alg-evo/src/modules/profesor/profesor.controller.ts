import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfesorService } from './profesor.service';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Get()
  getAll() {
    return this.profesorService.getAll();
  }
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.profesorService.getById(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.profesorService.create(data);
  }
}
