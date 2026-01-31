export interface TronSignRawTransactionAdapterRequest {
  rawJson: string;
  privateKey: string;
  txId?: string;
}

export interface TronSignRawTransactionAdapterResponse {
  txId: string;
  signature: string;
  refBlockBytes: string;
  refBlockHash: string;
  signedJson: string;
}
