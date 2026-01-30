export interface AddressValidateRequest {
  address: string;
}

export interface AddressValidateResponse {
  isValid: boolean;
}

export interface CoinAddressService<
  TGenerateRequest,
  TGenerateResponse,
  TValidateRequest = AddressValidateRequest,
  TValidateResponse = AddressValidateResponse,
> {
  generate(request: TGenerateRequest): TGenerateResponse;
  validate(request: TValidateRequest): TValidateResponse;
}

export interface CoinTransactionService<
  TBuildRequest,
  TBuildResponse,
  TTransferRequest = unknown,
  TTransferResponse = unknown,
> {
  buildTransaction(request: TBuildRequest): TBuildResponse;
  buildTransfer?(request: TTransferRequest): TTransferResponse;
}
