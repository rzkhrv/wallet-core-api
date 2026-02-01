/**
 * Adapter response payload for BTC transaction building.
 */
export interface BtcBuildTransactionUtxoIntent {
  txid: string;
  vout: number;
  amount: string;
  scriptPubKey: string;
}

export interface BtcBuildTransactionOutputIntent {
  address: string;
  amount: string;
  isChange: boolean;
}

export interface BtcBuildTransactionIntent {
  outputs: BtcBuildTransactionOutputIntent[];
  byteFee: string;
  utxos: BtcBuildTransactionUtxoIntent[];
  hashType: number;
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
