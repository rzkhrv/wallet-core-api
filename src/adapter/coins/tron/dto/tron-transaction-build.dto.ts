import type { TronBuildTransferAdapterRequest } from './tron-transaction-build-transfer.dto';

export type TronBuildTransactionAdapterRequest = TronBuildTransferAdapterRequest;

export interface TronBuildTransactionAdapterResponse {
  rawJson: string;
}
