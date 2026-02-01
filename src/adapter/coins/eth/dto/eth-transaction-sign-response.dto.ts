/**
 * Adapter response payload for ETH transaction signing.
 */
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
