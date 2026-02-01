/**
 * Adapter response payload for ETH address generation.
 */
export interface EthAddressGenerateAdapterOutput {
  address: string;
  keys: {
    public: string;
    private: string;
  };
  derivation: {
    path: string;
    purpose: number;
    coin: number;
    account: number;
    change: number;
    index: number;
  };
}
