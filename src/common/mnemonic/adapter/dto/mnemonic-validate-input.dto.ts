/**
 * Adapter request payload for mnemonic validation.
 */
export interface MnemonicValidateAdapterInput {
  mnemonic: string;
  passphrase?: string;
}
