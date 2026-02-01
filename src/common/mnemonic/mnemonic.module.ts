import { Module } from '@nestjs/common';
import { WalletCoreModule } from '../wallet-core/wallet-core.module';
import { MnemonicAdapter } from './adapter/mnemonic.adapter';
import { MnemonicController } from './mnemonic.controller';
import { MnemonicService } from './mnemonic.service';

/**
 * Module for mnemonic-related endpoints and services.
 */
@Module({
  imports: [WalletCoreModule],
  controllers: [MnemonicController],
  providers: [MnemonicAdapter, MnemonicService],
  exports: [MnemonicService],
})
export class MnemonicModule {}
