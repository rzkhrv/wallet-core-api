/**
 * UTXO input data for BTC transaction building.
 */
interface BtcUtxoInput {
  txid: string;
  vout: number;
  amount: string;
  scriptPubKey: string;
  reverseTxId?: boolean;
}

/**
 * Adapter request payload for BTC transaction building.
 */
export interface BtcBuildTransactionAdapterInput {
  toAddress: string;
  changeAddress: string;
  amount: string;
  byteFee: string;
  utxos: BtcUtxoInput[];
  hashType?: number;
  useMaxAmount?: boolean;
}
