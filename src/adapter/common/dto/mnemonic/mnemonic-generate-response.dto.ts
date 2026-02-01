/**
 * Adapter response payload for mnemonic generation.
 */
export interface MnemonicGenerateAdapterResponse {
  mnemonic: string;
  isPassphraseUsed: boolean;
  strengthBits: number;
}
