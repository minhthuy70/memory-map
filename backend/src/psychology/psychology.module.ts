import { Module } from '@nestjs/common';
import { PsychologyService } from './psychology.service';
import { PsychologyController } from './psychology.controller';

@Module({
  controllers: [PsychologyController],
  providers: [PsychologyService],
  exports: [PsychologyService],
})
export class PsychologyModule {}
