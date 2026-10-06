import { Module } from '@nestjs/common';
import { PrivacyVaultController } from './privacy-vault.controller';
import { PrivacyVaultService } from './privacy-vault.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrivacyVaultController],
  providers: [PrivacyVaultService],
  exports: [PrivacyVaultService],
})
export class PrivacyVaultModule {}
