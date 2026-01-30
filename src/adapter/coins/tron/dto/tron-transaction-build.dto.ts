import type { TW } from '@trustwallet/wallet-core';

export interface TronBuildTransactionAdapterRequest {
  rawJson?: string;
  transaction?: TW.Tron.Proto.ITransaction;
  privateKey: string;
  txId?: string;
}

export interface TronBuildTransactionAdapterResponse {
  txId: string;
  signature: string;
  refBlockBytes: string;
  refBlockHash: string;
  signedJson: string;
}
