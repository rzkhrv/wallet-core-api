import type { WalletCore } from '@trustwallet/wallet-core';
import type { WalletCoreCoinConfig } from '../../common/interfaces/wallet-core-coin-config.interface';
import type { WalletCoreResolvedCoinConfig } from '../../common/interfaces/wallet-core-resolved-coin-config.interface';

const ETH_WALLET_CORE_CONFIG: WalletCoreCoinConfig = {
  coinTypeKey: 'ethereum',
  purposeKey: 'bip44',
  derivationKey: 'default',
};

/**
 * Resolves ETH wallet-core configuration values.
 */
export const resolveEthWalletCoreConfig = (
  core: WalletCore,
): WalletCoreResolvedCoinConfig => {
  return {
    coinType: core.CoinType[ETH_WALLET_CORE_CONFIG.coinTypeKey],
    purpose: core.Purpose[ETH_WALLET_CORE_CONFIG.purposeKey],
    derivation: core.Derivation[ETH_WALLET_CORE_CONFIG.derivationKey],
  };
};
