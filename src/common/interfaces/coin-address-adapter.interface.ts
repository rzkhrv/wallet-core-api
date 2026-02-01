import type { AddressValidateAdapterInput } from './address-validate-adapter-input.interface';
import type { AddressValidateAdapterOutput } from './address-validate-adapter-output.interface';

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
  validate(request: AddressValidateAdapterInput): AddressValidateAdapterOutput;
}
