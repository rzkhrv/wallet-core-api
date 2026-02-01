/**
 * Mnemonic input payload for BTC address derivation.
 */
interface BtcMnemonicInput {
  value: string;
  passphrase?: string;
}

/**
 * Derivation path input for BTC address generation.
 */
interface BtcDerivationInput {
  account: number;
  change: number;
  index: number;
}

/**
 * Adapter request payload for BTC address generation.
 */
export interface BtcAddressGenerateAdapterRequest {
  mnemonic: BtcMnemonicInput;
  derivation: BtcDerivationInput;
}
