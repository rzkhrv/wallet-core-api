/**
 * Supported TRON transfer types.
 */
type TronTransferType = 'trx' | 'trc10' | 'trc20';

/**
 * Adapter request payload for TRON transfer building.
 */
export interface TronBuildTransferAdapterRequest {
  transferType: TronTransferType;
  ownerAddress: string;
  toAddress: string;
  amount: string;
  assetName?: string;
  contractAddress?: string;
  callValue?: string;
  timestamp?: string;
  expiration?: string;
  feeLimit?: string;
  memo?: string;
}
