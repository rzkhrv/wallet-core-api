/**
 * Adapter request payload for TRON raw transaction signing.
 */
export interface TronSignRawTransactionAdapterInput {
  rawJson: string;
  privateKey: string;
  txId?: string;
}
