export interface MnemonicValidateAdapterRequest {
  mnemonic: string;
  passphrase?: string;
}

export interface MnemonicValidateAdapterResponse {
  isValid: boolean;
}
