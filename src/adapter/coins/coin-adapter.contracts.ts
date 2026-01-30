export interface AddressValidateAdapterRequest {
  address: string;
}

export interface AddressValidateAdapterResponse {
  isValid: boolean;
}

export interface CoinAddressAdapter<TGenerateRequest, TGenerateResponse> {
  generate(request: TGenerateRequest): TGenerateResponse;
  validate(
    request: AddressValidateAdapterRequest,
  ): AddressValidateAdapterResponse;
}

export interface CoinTransactionAdapter<
  TBuildRequest,
  TBuildResponse,
  TTransferRequest = unknown,
  TTransferResponse = unknown,
> {
  buildTransaction(request: TBuildRequest): TBuildResponse;
  buildTransfer?(request: TTransferRequest): TTransferResponse;
}
