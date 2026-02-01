import type { WalletCore } from '@trustwallet/wallet-core';
import { COIN_CONFIG } from './coin-config.constants';
import type { ResolvedCoinConfig } from './resolved-coin-config.interface';
import { Coin } from './enum/coin.enum';

export const resolveCoinConfig = (
  core: WalletCore,
  coin: Coin,
): ResolvedCoinConfig => {
  const config = COIN_CONFIG[coin];

  return {
    coinType: core.CoinType[config.coinTypeKey],
    purpose: core.Purpose[config.purposeKey],
    derivation: core.Derivation[config.derivationKey],
  };
};
