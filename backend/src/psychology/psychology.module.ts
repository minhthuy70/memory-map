import { Module } from '@nestjs/common';
import { PsychologyController } from './psychology.controller';
import { PsychologyService } from './psychology.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PsychologyController],
  providers: [PsychologyService],
  exports: [PsychologyService],
})
export class PsychologyModule {}
