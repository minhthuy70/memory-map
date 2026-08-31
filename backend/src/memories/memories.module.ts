import { Module } from '@nestjs/common';

import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],

  controllers: [
    MemoriesController,
  ],

  providers: [
    MemoriesService,
  ],

  exports: [
    MemoriesService,
  ],
})
export class MemoriesModule {}