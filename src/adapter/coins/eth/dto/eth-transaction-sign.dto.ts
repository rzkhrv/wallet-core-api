/**
 * Adapter request payload for ETH transaction signing.
 */
export interface EthTransactionSignAdapterRequest {
  payload: string;
  privateKey: string;
}
