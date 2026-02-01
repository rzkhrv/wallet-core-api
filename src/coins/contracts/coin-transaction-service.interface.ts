/**
 * Contract for coin transaction services.
 */
export interface CoinTransactionService<
  TBuildRequest,
  TBuildResponse,
  TTransferRequest = unknown,
  TTransferResponse = unknown,
> {
  buildTransaction(request: TBuildRequest): TBuildResponse;
  buildTransfer?(request: TTransferRequest): TTransferResponse;
}
