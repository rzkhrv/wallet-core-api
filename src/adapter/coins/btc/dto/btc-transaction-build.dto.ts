export interface BtcUtxoInput {
  txid: string;
  vout: number;
  amount: string;
  scriptPubKey: string;
  reverseTxId?: boolean;
}

export interface BtcBuildTransactionAdapterRequest {
  toAddress: string;
  changeAddress: string;
  amount: string;
  byteFee: string;
  utxos: BtcUtxoInput[];
  hashType?: number;
  useMaxAmount?: boolean;
}

export interface BtcBuildTransactionAdapterResponse {
  payload: string;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}
