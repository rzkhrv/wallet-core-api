/**
 * Adapter response payload for TRON raw transaction signing.
 */
export interface TronSignRawTransactionAdapterResponse {
  txId: string;
  signature: string;
  refBlockBytes: string;
  refBlockHash: string;
  signedJson: string;
}
