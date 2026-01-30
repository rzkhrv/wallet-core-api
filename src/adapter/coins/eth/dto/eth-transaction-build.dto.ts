export interface EthTransactionBuildAdapterRequest {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  amount: string;
}

export interface EthTransactionBuildAdapterResponse {
  payload: string;
}
