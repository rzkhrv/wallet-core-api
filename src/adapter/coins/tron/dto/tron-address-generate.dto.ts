export interface TronMnemonicInput {
  value: string;
  passphrase?: string;
}

export interface TronDerivationInput {
  account: number;
  change: number;
  index: number;
}

export interface TronAddressGenerateAdapterRequest {
  mnemonic: TronMnemonicInput;
  derivation: TronDerivationInput;
}

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
