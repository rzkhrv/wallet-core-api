/**
 * Adapter response payload for TRON raw transaction signing.
 */
export interface TronSignRawTransactionAdapterOutput {
  txId: string;
  signature: string;
  refBlockBytes: string;
  refBlockHash: string;
  rawDataHex: string;
  signedJson: string;
  visible: boolean;
}
