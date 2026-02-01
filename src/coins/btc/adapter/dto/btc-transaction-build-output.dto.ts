/**
 * Adapter response payload for BTC transaction building.
 */
export interface BtcBuildTransactionAdapterOutput {
  payload: string;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}
