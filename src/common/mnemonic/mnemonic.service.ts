import { Injectable, Logger } from '@nestjs/common';
import { MnemonicAdapter } from './adapter/mnemonic.adapter';
import { GenerateMnemonicRequestDto } from './dto/request/generate-mnemonic.request.dto';
import { ValidateMnemonicRequestDto } from './dto/request/validate-mnemonic.request.dto';
import { GenerateMnemonicResponseDto } from './dto/response/generate-mnemonic.response.dto';
import { ValidateMnemonicResponseDto } from './dto/response/validate-mnemonic.response.dto';

/**
 * Provides mnemonic generation and validation operations.
 */
@Injectable()
export class MnemonicService {
  private readonly logger = new Logger(MnemonicService.name);

  constructor(private readonly mnemonicAdapter: MnemonicAdapter) {}

  /**
   * Generates a mnemonic phrase.
   * @param request Request payload.
   * @returns Generated mnemonic response.
   */
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

  /**
   * Validates a mnemonic phrase.
   * @param request Request payload.
   * @returns Validation result.
   */
  validate(request: ValidateMnemonicRequestDto): ValidateMnemonicResponseDto {
    this.logger.log('Validating mnemonic');
    return this.mnemonicAdapter.validate({
      mnemonic: request.mnemonic,
      passphrase: request.passphrase ?? '',
    });
  }
}
