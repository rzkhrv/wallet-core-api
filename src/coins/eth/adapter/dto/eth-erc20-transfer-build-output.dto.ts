/**
 * Adapter response payload for ERC20 transfer building.
 */
export interface EthErc20TransferIntent {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  tokenContract: string;
  amount: string;
}

export interface EthErc20TransferBuildAdapterOutput {
  payload: string;
  transaction: EthErc20TransferIntent;
}
