export interface EthTransactionBuildAdapterRequest {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  amount: string;
  privateKey: string;
}

export interface EthTransactionBuildAdapterResponse {
  rawTx: string;
  preHash: string;
  data: string;
  signature: {
    v: string;
    r: string;
    s: string;
  };
}
