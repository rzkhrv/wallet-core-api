/**
 * UTXO input data for BTC transaction building.
 */
interface BtcUtxoInput {
  txid: string;
  vout: number;
  amount: string;
  scriptPubKey: string;
}

interface BtcOutputInput {
  address: string;
  amount?: string;
  isChange?: boolean;
}

/**
 * Adapter request payload for BTC transaction building.
 */
export interface BtcBuildTransactionAdapterInput {
  outputs: BtcOutputInput[];
  byteFee: string;
  utxos: BtcUtxoInput[];
}
