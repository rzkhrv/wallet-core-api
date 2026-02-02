/**
 * Adapter input payload for TRON block header fields.
 */
export interface TronBlockHeaderInput {
  number: string;
  parentHash: string;
  txTrieRoot: string;
  witnessAddress: string;
  version: string;
  timestamp: string;
}
