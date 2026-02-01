import { Module } from '@nestjs/common';
import { WalletCoreModule } from '../../common/wallet-core/wallet-core.module';
import { BtcAddressAdapter } from './adapter/btc-address.adapter';
import { BtcTransactionAdapter } from './adapter/btc-transaction.adapter';
import { BtcAddressController } from './btc-address.controller';
import { BtcTransactionController } from './btc-transaction.controller';
import { BtcAddressService } from './service/btc-address.service';
import { BtcTransactionService } from './service/btc-transaction.service';

/**
 * Module for BTC address and transaction endpoints.
 */
@Module({
  imports: [WalletCoreModule],
  controllers: [BtcAddressController, BtcTransactionController],
  providers: [
    BtcAddressAdapter,
    BtcTransactionAdapter,
    BtcAddressService,
    BtcTransactionService,
  ],
  exports: [BtcAddressService, BtcTransactionService],
})
export class BtcModule {}
