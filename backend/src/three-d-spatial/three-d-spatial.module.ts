import { Module } from '@nestjs/common';
import { ThreeDSpatialService } from './three-d-spatial.service';
import { ThreeDSpatialController } from './three-d-spatial.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThreeDSpatialController],
  providers: [ThreeDSpatialService],
  exports: [ThreeDSpatialService],
})
export class ThreeDSpatialModule {}
