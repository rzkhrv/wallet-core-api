/**
 * Adapter request payload for ETH address generation.
 */
export interface EthAddressGenerateAdapterInput {
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
