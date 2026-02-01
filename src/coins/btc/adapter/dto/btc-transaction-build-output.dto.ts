/**
 * Adapter response payload for BTC transaction building.
 */
export interface BtcBuildTransactionUtxoIntent {
  txid: string;
  vout: number;
  amount: string;
  scriptPubKey: string;
  reverseTxId: boolean;
}

export interface BtcBuildTransactionIntent {
  toAddress: string;
  changeAddress: string;
  amount: string;
  byteFee: string;
  utxos: BtcBuildTransactionUtxoIntent[];
  hashType: number;
  useMaxAmount: boolean;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}

export interface BtcBuildTransactionAdapterOutput {
  payload: string;
  transaction: BtcBuildTransactionIntent;
}
