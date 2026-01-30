export interface MnemonicGenerateAdapterRequest {
  strength: number;
  passphrase?: string;
}

export interface MnemonicGenerateAdapterResponse {
  mnemonic: string;
  isPassphraseUsed: boolean;
  strengthBits: number;
}
