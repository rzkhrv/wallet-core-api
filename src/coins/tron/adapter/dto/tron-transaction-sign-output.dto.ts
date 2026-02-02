/**
 * Adapter response payload for TRON transaction signing.
 */
export interface TronTransactionSignAdapterOutput {
  txId: string;
  signature: string;
  refBlockBytes: string;
  refBlockHash: string;
  rawDataHex: string;
  signedJson: string;
  visible: boolean;
}
