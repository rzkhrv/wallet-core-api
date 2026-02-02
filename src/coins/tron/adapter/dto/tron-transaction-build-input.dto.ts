/**
 * Adapter input payload for TRON transaction building (native TRX).
 */
import type { TronBlockHeaderInput } from './tron-block-header-input.dto';

export interface TronTransactionBuildAdapterInput {
  ownerAddress: string;
  toAddress: string;
  amount: string;
  blockHeader: TronBlockHeaderInput;
  timestamp: string;
  expiration: string;
  feeLimit?: string;
  memo?: string;
}
