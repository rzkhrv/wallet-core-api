export interface EthErc20TransferAdapterRequest {
  chainId: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  toAddress: string;
  tokenContract: string;
  amount: string;
  privateKey: string;
}

export interface EthErc20TransferAdapterResponse {
  rawTx: string;
  preHash: string;
  data: string;
  signature: {
    v: string;
    r: string;
    s: string;
  };
}
