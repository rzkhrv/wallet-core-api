import { Coin } from './enum/coin.enum';
import type { WalletCore } from '@trustwallet/wallet-core';

export interface CoinConfig {
  coinTypeKey: keyof WalletCore['CoinType'];
  purposeKey: keyof WalletCore['Purpose'];
  derivationKey: keyof WalletCore['Derivation'];
}

export interface ResolvedCoinConfig {
  coinType: InstanceType<WalletCore['CoinType']>;
  purpose: InstanceType<WalletCore['Purpose']>;
  derivation: InstanceType<WalletCore['Derivation']>;
}

export const COIN_CONFIG: Record<Coin, CoinConfig> = {
  [Coin.BTC]: {
    coinTypeKey: 'bitcoin',
    purposeKey: 'bip84',
    derivationKey: 'bitcoinSegwit',
  },
  [Coin.ETH]: {
    coinTypeKey: 'ethereum',
    purposeKey: 'bip44',
    derivationKey: 'default',
  },
  [Coin.TRON]: {
    coinTypeKey: 'tron',
    purposeKey: 'bip44',
    derivationKey: 'default',
  },
};

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
