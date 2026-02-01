/**
 * Adapter request payload for mnemonic validation.
 */
export interface MnemonicValidateAdapterRequest {
  mnemonic: string;
  passphrase?: string;
}
