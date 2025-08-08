import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LaboratorioModule } from './modules/laboratorio/laboratorio.module';
import { CursoModule } from './modules/curso/curso.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfesorModule } from './modules/profesor/profesor.module';

@Module({
  imports: [LaboratorioModule, CursoModule, PrismaModule, ProfesorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
