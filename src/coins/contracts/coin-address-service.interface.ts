import type { AddressValidateRequest } from './address-validate-request.interface';
import type { AddressValidateResponse } from './address-validate-response.interface';

/**
 * Contract for coin address services.
 */
export interface CoinAddressService<
  TGenerateRequest,
  TGenerateResponse,
  TValidateRequest = AddressValidateRequest,
  TValidateResponse = AddressValidateResponse,
> {
  generate(request: TGenerateRequest): TGenerateResponse;
  validate(request: TValidateRequest): TValidateResponse;
}
