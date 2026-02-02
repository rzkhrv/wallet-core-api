/**
 * Adapter input payload for TRON token transfer building.
 */
import type { TronBlockHeaderInput } from './tron-block-header-input.dto';

export interface TronTransferBuildAdapterInput {
  ownerAddress: string;
  toAddress: string;
  amount: string;
  blockHeader: TronBlockHeaderInput;
  contractAddress: string;
  callValue?: string;
  timestamp: string;
  expiration: string;
  feeLimit?: string;
  memo?: string;
}
