import { Module } from '@nestjs/common';
import { ThreeDSpatialService } from './three-d-spatial.service';
import { ThreeDSpatialController } from './three-d-spatial.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ThreeDSpatialController],
  providers: [ThreeDSpatialService],
  exports: [ThreeDSpatialService],
})
export class ThreeDSpatialModule {}
