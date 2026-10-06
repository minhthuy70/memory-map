import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MemoriesModule } from './memories/memories.module';
import { CategoriesModule } from './categories/categories.module';
import { SessionsModule } from './sessions/sessions.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventStreamingModule } from './event-streaming/event-streaming.module';
import { HybridCloudModule } from './hybrid-cloud/hybrid-cloud.module';
import { AICompanionModule } from './ai-companion/ai-companion.module';
import { PrivacyVaultModule } from './privacy-vault/privacy-vault.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    PrismaModule,

    UsersModule,

    AuthModule,

    MemoriesModule,

    CategoriesModule,

    SessionsModule,

    EventStreamingModule,

    HybridCloudModule,

    AICompanionModule,

    PrivacyVaultModule,

    GamificationModule,
  ],
})
export class AppModule {}