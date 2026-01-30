export interface EthErc20TransferSignAdapterRequest {
  payload: string;
  privateKey: string;
}

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
