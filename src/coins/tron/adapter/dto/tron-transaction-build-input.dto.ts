/**
 * Adapter input payload for TRON transaction building (native TRX).
 */
export interface TronTransactionBuildAdapterInput {
  ownerAddress: string;
  toAddress: string;
  amount: string;
  blockId: string;
  blockNumber: string;
  timestamp?: string;
  expiration?: string;
  feeLimit?: string;
  memo?: string;
}
