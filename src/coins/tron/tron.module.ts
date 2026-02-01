import { Module } from '@nestjs/common';
import { AdapterModule } from '../../adapter/adapter.module';
import { TronAddressController } from './tron-address.controller';
import { TronTransactionController } from './tron-transaction.controller';
import { TronAddressService } from './service/tron-address.service';
import { TronTransactionService } from './service/tron-transaction.service';

/**
 * Module for TRON address and transaction endpoints.
 */
@Module({
  imports: [AdapterModule],
  controllers: [TronAddressController, TronTransactionController],
  providers: [TronAddressService, TronTransactionService],
  exports: [TronAddressService, TronTransactionService],
})
export class TronModule {}
