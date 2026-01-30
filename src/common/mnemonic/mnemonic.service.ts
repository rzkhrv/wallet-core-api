import { Injectable, Logger } from '@nestjs/common';
import { MnemonicAdapter } from '../../adapter/common/mnemonic.adapter';
import { GenerateMnemonicRequestDto } from './dto/request/generate-mnemonic.request.dto';
import { ValidateMnemonicRequestDto } from './dto/request/validate-mnemonic.request.dto';
import { GenerateMnemonicResponseDto } from './dto/response/generate-mnemonic.response.dto';
import { ValidateMnemonicResponseDto } from './dto/response/validate-mnemonic.response.dto';

@Injectable()
export class MnemonicService {
  private readonly logger = new Logger(MnemonicService.name);

  constructor(private readonly mnemonicAdapter: MnemonicAdapter) {}

  generate(request: GenerateMnemonicRequestDto): GenerateMnemonicResponseDto {
    this.logger.log(
      `Generating mnemonic (strength=${request.strength}, passphraseUsed=${Boolean(
        request.passphrase,
      )})`,
    );
    return this.mnemonicAdapter.generate({
      strength: request.strength,
      passphrase: request.passphrase ?? '',
    });
  }

  validate(request: ValidateMnemonicRequestDto): ValidateMnemonicResponseDto {
    this.logger.log('Validating mnemonic');
    return this.mnemonicAdapter.validate({
      mnemonic: request.mnemonic,
      passphrase: request.passphrase ?? '',
    });
  }
}
