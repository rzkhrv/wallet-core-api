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
  privateKeys: string[];
  hashType?: number;
  useMaxAmount?: boolean;
}

export interface BtcBuildTransactionAdapterResponse {
  rawTx: string;
  txId: string;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}
