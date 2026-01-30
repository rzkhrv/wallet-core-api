export interface EthTransactionSignAdapterRequest {
  payload: string;
  privateKey: string;
}

export interface EthTransactionSignAdapterResponse {
  rawTx: string;
  preHash: string;
  data: string;
  signature: {
    v: string;
    r: string;
    s: string;
  };
}
