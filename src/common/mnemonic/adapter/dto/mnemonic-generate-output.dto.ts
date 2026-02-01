/**
 * Adapter response payload for mnemonic generation.
 */
export interface MnemonicGenerateAdapterOutput {
  mnemonic: string;
  isPassphraseUsed: boolean;
  strengthBits: number;
}
