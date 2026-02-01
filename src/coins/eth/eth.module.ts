import { Module } from '@nestjs/common';
import { WalletCoreModule } from '../../common/wallet-core/wallet-core.module';
import { EthAddressAdapter } from './adapter/eth-address.adapter';
import { EthTransactionAdapter } from './adapter/eth-transaction.adapter';
import { EthAddressController } from './eth-address.controller';
import { EthTransactionController } from './eth-transaction.controller';
import { EthAddressService } from './service/eth-address.service';
import { EthTransactionService } from './service/eth-transaction.service';

/**
 * Module for ETH address and transaction endpoints.
 */
@Module({
  imports: [WalletCoreModule],
  controllers: [EthAddressController, EthTransactionController],
  providers: [
    EthAddressAdapter,
    EthTransactionAdapter,
    EthAddressService,
    EthTransactionService,
  ],
  exports: [EthAddressService, EthTransactionService],
})
export class EthModule {}
