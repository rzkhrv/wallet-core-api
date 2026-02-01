/**
 * Contract for transaction adapters.
 */
export interface CoinTransactionAdapter<
  TBuildRequest,
  TBuildResponse,
  TTransferRequest = unknown,
  TTransferResponse = unknown,
> {
  /**
   * Builds a transaction payload.
   * @param request Adapter request payload.
   * @returns Adapter response payload.
   */
  buildTransaction(request: TBuildRequest): TBuildResponse;
  /**
   * Builds a transfer payload when supported by the adapter.
   * @param request Adapter request payload.
   * @returns Adapter response payload.
   */
  buildTransfer?(request: TTransferRequest): TTransferResponse;
}
