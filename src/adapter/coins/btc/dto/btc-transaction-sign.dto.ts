/**
 * Adapter request payload for BTC transaction signing.
 */
export interface BtcSignTransactionAdapterRequest {
  payload: string;
  privateKeys: string[];
}
