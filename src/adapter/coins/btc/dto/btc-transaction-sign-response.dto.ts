/**
 * Adapter response payload for BTC transaction signing.
 */
export interface BtcSignTransactionAdapterResponse {
  rawTx: string;
  txId: string;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}
