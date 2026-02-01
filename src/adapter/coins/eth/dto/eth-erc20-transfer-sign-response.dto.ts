/**
 * Adapter response payload for ERC20 transfer signing.
 */
export interface EthErc20TransferSignAdapterResponse {
  rawTx: string;
  preHash: string;
  data: string;
  signature: {
    v: string;
    r: string;
    s: string;
  };
}
