export interface BtcSignTransactionAdapterRequest {
  payload: string;
  privateKeys: string[];
}

export interface BtcSignTransactionAdapterResponse {
  rawTx: string;
  txId: string;
  plan: {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  };
}
