import type { WalletCore } from '@trustwallet/wallet-core';

/**
 * Resolved wallet-core coin configuration values.
 */
export interface ResolvedCoinConfig {
  coinType: InstanceType<WalletCore['CoinType']>;
  purpose: InstanceType<WalletCore['Purpose']>;
  derivation: InstanceType<WalletCore['Derivation']>;
}
