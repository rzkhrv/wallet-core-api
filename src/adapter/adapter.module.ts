import { Module } from '@nestjs/common';
import { MnemonicAdapter } from './common/mnemonic.adapter';
import { WalletCoreAdapter } from './common/wallet-core.adapter';
import { BtcAddressAdapter } from './coins/btc/btc-address.adapter';
import { BtcTransactionAdapter } from './coins/btc/btc-transaction.adapter';
import { EthAddressAdapter } from './coins/eth/eth-address.adapter';
import { EthTransactionAdapter } from './coins/eth/eth-transaction.adapter';
import { TronAddressAdapter } from './coins/tron/tron-address.adapter';
import { TronTransactionAdapter } from './coins/tron/tron-transaction.adapter';

@Module({
  providers: [
    WalletCoreAdapter,
    MnemonicAdapter,
    BtcAddressAdapter,
    BtcTransactionAdapter,
    EthAddressAdapter,
    EthTransactionAdapter,
    TronAddressAdapter,
    TronTransactionAdapter,
  ],
  exports: [
    WalletCoreAdapter,
    MnemonicAdapter,
    BtcAddressAdapter,
    BtcTransactionAdapter,
    EthAddressAdapter,
    EthTransactionAdapter,
    TronAddressAdapter,
    TronTransactionAdapter,
  ],
})
export class AdapterModule {}
