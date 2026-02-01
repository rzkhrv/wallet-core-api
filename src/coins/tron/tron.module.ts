import { Module } from '@nestjs/common';
import { WalletCoreModule } from '../../common/wallet-core/wallet-core.module';
import { TronAddressAdapter } from './adapter/tron-address.adapter';
import { TronTransactionAdapter } from './adapter/tron-transaction.adapter';
import { TronAddressController } from './tron-address.controller';
import { TronTransactionController } from './tron-transaction.controller';
import { TronAddressService } from './service/tron-address.service';
import { TronTransactionService } from './service/tron-transaction.service';

/**
 * Module for TRON address and transaction endpoints.
 */
@Module({
  imports: [WalletCoreModule],
  controllers: [TronAddressController, TronTransactionController],
  providers: [
    TronAddressAdapter,
    TronTransactionAdapter,
    TronAddressService,
    TronTransactionService,
  ],
  exports: [TronAddressService, TronTransactionService],
})
export class TronModule {}
