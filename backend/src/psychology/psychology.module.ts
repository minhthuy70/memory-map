import { Module } from '@nestjs/common';
import { PsychologyService } from './psychology.service';
import { PsychologyController } from './psychology.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PsychologyController],
  providers: [PsychologyService],
  exports: [PsychologyService],
})
export class PsychologyModule {}
