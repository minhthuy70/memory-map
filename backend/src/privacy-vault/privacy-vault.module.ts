import { Module } from '@nestjs/common';
import { PrivacyVaultController } from './privacy-vault.controller';
import { PrivacyVaultService } from './privacy-vault.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PrivacyVaultController],
  providers: [PrivacyVaultService],
  exports: [PrivacyVaultService],
})
export class PrivacyVaultModule {}
