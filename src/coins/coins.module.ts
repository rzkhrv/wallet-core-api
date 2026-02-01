import { Module } from '@nestjs/common';
import { BtcModule } from './btc/btc.module';
import { EthModule } from './eth/eth.module';
import { TronModule } from './tron/tron.module';

/**
 * Aggregates all coin-specific modules.
 */
@Module({
  imports: [BtcModule, EthModule, TronModule],
  exports: [BtcModule, EthModule, TronModule],
})
export class CoinsModule {}
