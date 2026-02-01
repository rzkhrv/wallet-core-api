/**
 * Adapter response payload for TRON address generation.
 */
export interface TronAddressGenerateAdapterResponse {
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
