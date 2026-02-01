/**
 * Adapter request payload for ETH transaction building.
 */
export interface EthTransactionBuildAdapterRequest {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  amount: string;
}
