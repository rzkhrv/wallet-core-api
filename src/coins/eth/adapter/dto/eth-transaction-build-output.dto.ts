/**
 * Adapter response payload for ETH transaction building.
 */
export interface EthTransactionIntent {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  amount: string;
}

export interface EthTransactionBuildAdapterOutput {
  payload: string;
  transaction: EthTransactionIntent;
}
