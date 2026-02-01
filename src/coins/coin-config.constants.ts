import { Coin } from './enum/coin.enum';
import type { CoinConfig } from './coin-config.interface';

/**
 * Static coin configuration mapping for wallet-core.
 */
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
