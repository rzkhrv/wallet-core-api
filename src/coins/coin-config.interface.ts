import type { WalletCore } from '@trustwallet/wallet-core';

/**
 * Configuration keys used to resolve wallet-core coin metadata.
 */
export interface CoinConfig {
  coinTypeKey: keyof WalletCore['CoinType'];
  purposeKey: keyof WalletCore['Purpose'];
  derivationKey: keyof WalletCore['Derivation'];
}
