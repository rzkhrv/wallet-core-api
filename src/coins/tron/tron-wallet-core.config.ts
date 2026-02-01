import type { WalletCore } from '@trustwallet/wallet-core';
import type { WalletCoreCoinConfig } from '../../common/interfaces/wallet-core-coin-config.interface';
import type { WalletCoreResolvedCoinConfig } from '../../common/interfaces/wallet-core-resolved-coin-config.interface';

const TRON_WALLET_CORE_CONFIG: WalletCoreCoinConfig = {
  coinTypeKey: 'tron',
  purposeKey: 'bip44',
  derivationKey: 'default',
};

/**
 * Resolves TRON wallet-core configuration values.
 */
export const resolveTronWalletCoreConfig = (
  core: WalletCore,
): WalletCoreResolvedCoinConfig => {
  return {
    coinType: core.CoinType[TRON_WALLET_CORE_CONFIG.coinTypeKey],
    purpose: core.Purpose[TRON_WALLET_CORE_CONFIG.purposeKey],
    derivation: core.Derivation[TRON_WALLET_CORE_CONFIG.derivationKey],
  };
};
