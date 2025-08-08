import { Module } from '@nestjs/common';
import { LaboratorioService } from './laboratorio.service';
import { LaboratorioController } from './laboratorio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LaboratorioController],
  providers: [LaboratorioService],
  imports: [PrismaModule],
})
export class LaboratorioModule {}
