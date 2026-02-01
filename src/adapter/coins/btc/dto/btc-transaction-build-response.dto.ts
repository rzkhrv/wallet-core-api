/**
 * Adapter response payload for BTC transaction building.
 */
export interface BtcBuildTransactionAdapterResponse {
  payload: string;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}
