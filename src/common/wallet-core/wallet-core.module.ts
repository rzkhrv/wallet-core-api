import { Module } from '@nestjs/common';
import { WalletCoreAdapter } from './wallet-core.adapter';

/**
 * Module that provides the shared wallet-core adapter.
 */
@Module({
  providers: [WalletCoreAdapter],
  exports: [WalletCoreAdapter],
})
export class WalletCoreModule {}
