/**
 * Mnemonic input payload for TRON address derivation.
 */
interface TronMnemonicInput {
  value: string;
  passphrase?: string;
}

/**
 * Derivation path input for TRON address generation.
 */
interface TronDerivationInput {
  account: number;
  change: number;
  index: number;
}

/**
 * Adapter request payload for TRON address generation.
 */
export interface TronAddressGenerateAdapterInput {
  mnemonic: TronMnemonicInput;
  derivation: TronDerivationInput;
}
