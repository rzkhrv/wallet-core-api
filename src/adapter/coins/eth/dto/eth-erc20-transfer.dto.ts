export interface EthErc20TransferBuildAdapterRequest {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  tokenContract: string;
  amount: string;
}

export interface EthErc20TransferBuildAdapterResponse {
  payload: string;
}
