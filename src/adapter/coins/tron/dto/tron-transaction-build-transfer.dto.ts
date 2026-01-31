export type TronTransferType = 'trx' | 'trc10';

export interface TronBuildTransferAdapterRequest {
  transferType: TronTransferType;
  ownerAddress: string;
  toAddress: string;
  amount: string;
  assetName?: string;
  timestamp?: string;
  expiration?: string;
  feeLimit?: string;
  memo?: string;
}
