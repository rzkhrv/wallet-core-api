/**
 * Adapter request payload for TRON raw transaction signing.
 */
export interface TronSignRawTransactionAdapterRequest {
  rawJson: string;
  privateKey: string;
  txId?: string;
}
