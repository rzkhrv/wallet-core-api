import { Injectable, Logger } from '@nestjs/common';
import { TronAddressGenerateAdapterInput } from '../adapter/dto/tron-address-generate-input.dto';
import { TronAddressValidateAdapterInput } from '../adapter/dto/tron-address-validate-input.dto';
import { TronAddressValidateAdapterOutput } from '../adapter/dto/tron-address-validate-output.dto';
import { TronAddressAdapter } from '../adapter/tron-address.adapter';
import { CoinAddressService } from '../../../common/interfaces/coin-address-service.interface';
import { GenerateTronAddressRequestDto } from '../dto/request/generate-tron-address.request.dto';
import { ValidateTronAddressRequestDto } from '../dto/request/validate-tron-address.request.dto';
import { GenerateTronAddressResponseDto } from '../dto/response/generate-tron-address.response.dto';
import { ValidateTronAddressResponseDto } from '../dto/response/validate-tron-address.response.dto';

/**
 * Provides TRON address generation and validation operations.
 */
@Injectable()
export class TronAddressService implements CoinAddressService<
  GenerateTronAddressRequestDto,
  GenerateTronAddressResponseDto,
  ValidateTronAddressRequestDto,
  ValidateTronAddressResponseDto
> {
  private readonly logger = new Logger(TronAddressService.name);

  constructor(private readonly tronAddressAdapter: TronAddressAdapter) {}

  /**
   * Generates a TRON address from mnemonic and derivation parameters.
   * @param request Request payload.
   * @returns Generated address response.
   */
  generate(
    request: GenerateTronAddressRequestDto,
  ): GenerateTronAddressResponseDto {
    this.logger.log(
      `Generating TRON address (account=${request.derivation.account}, change=${request.derivation.change}, index=${request.derivation.index})`,
    );

    const adapterRequest: TronAddressGenerateAdapterInput = {
      mnemonic: {
        value: request.mnemonic.value,
        passphrase: request.mnemonic.passphrase ?? '',
      },
      derivation: {
        account: request.derivation.account,
        change: Number(request.derivation.change),
        index: request.derivation.index,
      },
    };

    return this.tronAddressAdapter.generate(adapterRequest);
  }

  /**
   * Validates a TRON address.
   * @param request Request payload.
   * @returns Validation result.
   */
  validate(
    request: ValidateTronAddressRequestDto,
  ): ValidateTronAddressResponseDto {
    this.logger.log('Validating TRON address');
    const adapterRequest: TronAddressValidateAdapterInput = {
      address: request.address,
    };

    const result: TronAddressValidateAdapterOutput =
      this.tronAddressAdapter.validate(adapterRequest);

    return result;
  }
}
