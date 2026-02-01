/**
 * Adapter request payload for ERC20 transfer building.
 */
export interface EthErc20TransferBuildAdapterInput {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  tokenContract: string;
  amount: string;
}
