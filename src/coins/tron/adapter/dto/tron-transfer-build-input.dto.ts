/**
 * Adapter input payload for TRON token transfer building.
 */
export interface TronTransferBuildAdapterInput {
  ownerAddress: string;
  toAddress: string;
  amount: string;
  blockId: string;
  blockNumber: string;
  contractAddress: string;
  callValue?: string;
  timestamp: string;
  expiration: string;
  feeLimit?: string;
  memo?: string;
}
