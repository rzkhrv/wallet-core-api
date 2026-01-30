import { Injectable, Logger } from '@nestjs/common';
import {
  BtcAddressGenerateAdapterRequest,
  BtcAddressGenerateAdapterResponse,
} from '../../../adapter/coins/btc/dto/btc-address-generate.dto';
import {
  BtcAddressValidateAdapterRequest,
  BtcAddressValidateAdapterResponse,
} from '../../../adapter/coins/btc/dto/btc-address-validate.dto';
import { BtcAddressAdapter } from '../../../adapter/coins/btc/btc-address.adapter';
import { CoinAddressService } from '../../contracts/coin-service.contracts';
import { GenerateBtcAddressRequestDto } from '../dto/request/generate-btc-address.request.dto';
import { ValidateBtcAddressRequestDto } from '../dto/request/validate-btc-address.request.dto';
import { GenerateBtcAddressResponseDto } from '../dto/response/generate-btc-address.response.dto';
import { ValidateBtcAddressResponseDto } from '../dto/response/validate-btc-address.response.dto';

@Injectable()
export class BtcAddressService implements CoinAddressService<
  GenerateBtcAddressRequestDto,
  GenerateBtcAddressResponseDto,
  ValidateBtcAddressRequestDto,
  ValidateBtcAddressResponseDto
> {
  private readonly logger = new Logger(BtcAddressService.name);

  constructor(private readonly btcAddressAdapter: BtcAddressAdapter) {}

  generate(
    request: GenerateBtcAddressRequestDto,
  ): GenerateBtcAddressResponseDto {
    this.logger.log(
      `Generating BTC address (account=${request.derivation.account}, change=${request.derivation.change}, index=${request.derivation.index})`,
    );
    const adapterRequest: BtcAddressGenerateAdapterRequest = {
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

    const result: BtcAddressGenerateAdapterResponse =
      this.btcAddressAdapter.generate(adapterRequest);

    return result;
  }

  validate(
    request: ValidateBtcAddressRequestDto,
  ): ValidateBtcAddressResponseDto {
    this.logger.log('Validating BTC address');
    const adapterRequest: BtcAddressValidateAdapterRequest = {
      address: request.address,
    };

    const result: BtcAddressValidateAdapterResponse =
      this.btcAddressAdapter.validate(adapterRequest);

    return result;
  }
}
