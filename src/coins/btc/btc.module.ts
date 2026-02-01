import { Module } from '@nestjs/common';
import { AdapterModule } from '../../adapter/adapter.module';
import { BtcAddressController } from './btc-address.controller';
import { BtcTransactionController } from './btc-transaction.controller';
import { BtcAddressService } from './service/btc-address.service';
import { BtcTransactionService } from './service/btc-transaction.service';

/**
 * Module for BTC address and transaction endpoints.
 */
@Module({
  imports: [AdapterModule],
  controllers: [BtcAddressController, BtcTransactionController],
  providers: [BtcAddressService, BtcTransactionService],
  exports: [BtcAddressService, BtcTransactionService],
})
export class BtcModule {}
