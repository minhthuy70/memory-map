import { Module } from '@nestjs/common';
import { AICompanionController } from './ai-companion.controller';
import { AICompanionService } from './ai-companion.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AICompanionController],
  providers: [AICompanionService],
  exports: [AICompanionService],
})
export class AICompanionModule {}
