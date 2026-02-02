export type TronTransactionType = 'trx' | 'trc20';

export interface TronTransactionIntent {
  type: TronTransactionType;
  ownerAddress: string;
  toAddress: string;
  amount: string;
  contractAddress?: string;
  callValue?: string | null;
  timestamp: string;
  expiration: string;
  feeLimit?: string | null;
  memo?: string | null;
}

/**
 * Adapter response payload for TRON transaction building.
 */
export interface TronTransactionBuildAdapterOutput {
  payload: string;
  transaction: TronTransactionIntent;
}
