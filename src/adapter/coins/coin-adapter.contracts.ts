/**
 * Adapter request payload for address validation.
 */
export interface AddressValidateAdapterRequest {
  address: string;
}

/**
 * Adapter response payload for address validation.
 */
export interface AddressValidateAdapterResponse {
  isValid: boolean;
}

/**
 * Contract for address adapters.
 */
export interface CoinAddressAdapter<TGenerateRequest, TGenerateResponse> {
  /**
   * Generates an address from adapter request data.
   * @param request Adapter request payload.
   * @returns Adapter response payload.
   */
  generate(request: TGenerateRequest): TGenerateResponse;
  /**
   * Validates an address.
   * @param request Adapter request payload.
   * @returns Adapter response payload.
   */
  validate(
    request: AddressValidateAdapterRequest,
  ): AddressValidateAdapterResponse;
}

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
