import { Module } from '@nestjs/common';
import { AdapterModule } from '../../adapter/adapter.module';
import { EthAddressController } from './eth-address.controller';
import { EthTransactionController } from './eth-transaction.controller';
import { EthAddressService } from './service/eth-address.service';
import { EthTransactionService } from './service/eth-transaction.service';

@Module({
  imports: [AdapterModule],
  controllers: [EthAddressController, EthTransactionController],
  providers: [EthAddressService, EthTransactionService],
  exports: [EthAddressService, EthTransactionService],
})
export class EthModule {}
