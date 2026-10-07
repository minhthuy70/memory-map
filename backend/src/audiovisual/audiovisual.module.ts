import { Module } from '@nestjs/common';
import { AudiovisualController } from './audiovisual.controller';
import { AudiovisualService } from './audiovisual.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AudiovisualController],
  providers: [AudiovisualService],
  exports: [AudiovisualService],
})
export class AudiovisualModule {}
