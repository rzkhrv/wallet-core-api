/**
 * Adapter request payload for ETH address generation.
 */
export interface EthAddressGenerateAdapterRequest {
  mnemonic: {
    value: string;
    passphrase?: string;
  };
  derivation: {
    account: number;
    change: number;
    index: number;
  };
}
