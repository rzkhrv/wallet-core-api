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

export interface EthAddressGenerateAdapterResponse {
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
