import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CursoController],
  providers: [CursoService],
  imports: [PrismaModule],
})
export class CursoModule {}
