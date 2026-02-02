/**
 * Adapter request payload for TRON transaction signing.
 */
export interface TronTransactionSignAdapterInput {
  payload: string;
  privateKey: string;
  txId?: string;
}
