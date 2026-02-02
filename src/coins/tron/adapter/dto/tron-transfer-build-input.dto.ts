/**
 * Supported TRON token transfer types.
 */
type TronTransferType = 'trc10' | 'trc20';

/**
 * Adapter input payload for TRON token transfer building.
 */
export interface TronTransferBuildAdapterInput {
  transferType: TronTransferType;
  ownerAddress: string;
  toAddress: string;
  amount: string;
  blockId: string;
  blockNumber: string;
  assetName?: string;
  contractAddress?: string;
  callValue?: string;
  timestamp?: string;
  expiration?: string;
  feeLimit?: string;
  memo?: string;
}
