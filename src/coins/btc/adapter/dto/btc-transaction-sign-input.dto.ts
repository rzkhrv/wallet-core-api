/**
 * Adapter request payload for BTC transaction signing.
 */
export interface BtcSignTransactionAdapterInput {
  payload: string;
  privateKeys: string[];
}
