export interface BtcMnemonicInput {
  value: string;
  passphrase?: string;
}

export interface BtcDerivationInput {
  account: number;
  change: number;
  index: number;
}

export interface BtcAddressGenerateAdapterRequest {
  mnemonic: BtcMnemonicInput;
  derivation: BtcDerivationInput;
}

export interface BtcAddressGenerateAdapterResponse {
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
