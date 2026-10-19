import { Module } from '@nestjs/common';
import { AudiovisualController } from './audiovisual.controller';
import { AudiovisualService } from './audiovisual.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AudiovisualController],
  providers: [AudiovisualService],
  exports: [AudiovisualService],
})
export class AudiovisualModule {}
