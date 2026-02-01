import { Injectable, Logger } from '@nestjs/common';
import { EthAddressGenerateAdapterRequest } from '../../../adapter/coins/eth/dto/eth-address-generate.dto';
import { EthAddressGenerateAdapterResponse } from '../../../adapter/coins/eth/dto/eth-address-generate-response.dto';
import { EthAddressValidateAdapterRequest } from '../../../adapter/coins/eth/dto/eth-address-validate.dto';
import { EthAddressValidateAdapterResponse } from '../../../adapter/coins/eth/dto/eth-address-validate-response.dto';
import { EthAddressAdapter } from '../../../adapter/coins/eth/eth-address.adapter';
import { CoinAddressService } from '../../contracts/coin-address-service.interface';
import { GenerateEthAddressRequestDto } from '../dto/request/generate-eth-address.request.dto';
import { ValidateEthAddressRequestDto } from '../dto/request/validate-eth-address.request.dto';
import { GenerateEthAddressResponseDto } from '../dto/response/generate-eth-address.response.dto';
import { ValidateEthAddressResponseDto } from '../dto/response/validate-eth-address.response.dto';

/**
 * Provides ETH address generation and validation operations.
 */
@Injectable()
export class EthAddressService implements CoinAddressService<
  GenerateEthAddressRequestDto,
  GenerateEthAddressResponseDto,
  ValidateEthAddressRequestDto,
  ValidateEthAddressResponseDto
> {
  private readonly logger = new Logger(EthAddressService.name);

  constructor(private readonly ethAddressAdapter: EthAddressAdapter) {}

  /**
   * Generates an ETH address from mnemonic and derivation parameters.
   * @param request Request payload.
   * @returns Generated address response.
   */
  generate(
    request: GenerateEthAddressRequestDto,
  ): GenerateEthAddressResponseDto {
    this.logger.log(
      `Generating ETH address (account=${request.derivation.account}, change=${request.derivation.change}, index=${request.derivation.index})`,
    );
    const adapterRequest: EthAddressGenerateAdapterRequest = {
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

    const result: EthAddressGenerateAdapterResponse =
      this.ethAddressAdapter.generate(adapterRequest);

    return result;
  }

  /**
   * Validates an ETH address.
   * @param request Request payload.
   * @returns Validation result.
   */
  validate(
    request: ValidateEthAddressRequestDto,
  ): ValidateEthAddressResponseDto {
    this.logger.log('Validating ETH address');
    const adapterRequest: EthAddressValidateAdapterRequest = {
      address: request.address,
    };

    const result: EthAddressValidateAdapterResponse =
      this.ethAddressAdapter.validate(adapterRequest);

    return result;
  }
}
