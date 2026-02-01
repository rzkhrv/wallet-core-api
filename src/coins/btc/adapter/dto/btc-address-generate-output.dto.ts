/**
 * Adapter response payload for BTC address generation.
 */
export interface BtcAddressGenerateAdapterOutput {
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
