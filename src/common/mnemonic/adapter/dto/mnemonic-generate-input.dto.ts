/**
 * Adapter request payload for mnemonic generation.
 */
export interface MnemonicGenerateAdapterInput {
  strength: number;
  passphrase?: string;
}
