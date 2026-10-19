import { Module } from '@nestjs/common';
import { HybridCloudController } from './hybrid-cloud.controller';
import { HybridCloudService } from './hybrid-cloud.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [HybridCloudController],
  providers: [HybridCloudService],
  exports: [HybridCloudService],
})
export class HybridCloudModule {}
