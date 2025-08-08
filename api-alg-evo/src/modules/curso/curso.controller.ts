import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CursoService } from './curso.service';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Get()
  getAll() {
    return this.cursoService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.cursoService.getById(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.cursoService.create(data);
  }
}
