import type { WalletCore } from '@trustwallet/wallet-core';
import type { WalletCoreCoinConfig } from '../../common/interfaces/wallet-core-coin-config.interface';
import type { WalletCoreResolvedCoinConfig } from '../../common/interfaces/wallet-core-resolved-coin-config.interface';

const BTC_WALLET_CORE_CONFIG: WalletCoreCoinConfig = {
  coinTypeKey: 'bitcoin',
  purposeKey: 'bip84',
  derivationKey: 'bitcoinSegwit',
};

/**
 * Resolves BTC wallet-core configuration values.
 */
export const resolveBtcWalletCoreConfig = (
  core: WalletCore,
): WalletCoreResolvedCoinConfig => {
  return {
    coinType: core.CoinType[BTC_WALLET_CORE_CONFIG.coinTypeKey],
    purpose: core.Purpose[BTC_WALLET_CORE_CONFIG.purposeKey],
    derivation: core.Derivation[BTC_WALLET_CORE_CONFIG.derivationKey],
  };
};
