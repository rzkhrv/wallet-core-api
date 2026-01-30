export interface TronSignRawTransactionAdapterRequest {
  rawJson: string;
  privateKey: string;
  txId?: string;
}
