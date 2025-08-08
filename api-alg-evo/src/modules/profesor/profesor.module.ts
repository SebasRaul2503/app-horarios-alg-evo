import { Module } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorController } from './profesor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProfesorController],
  providers: [ProfesorService],
  imports: [PrismaModule],
})
export class ProfesorModule {}
