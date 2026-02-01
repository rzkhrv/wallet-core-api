/**
 * Adapter request payload for mnemonic generation.
 */
export interface MnemonicGenerateAdapterRequest {
  strength: number;
  passphrase?: string;
}
