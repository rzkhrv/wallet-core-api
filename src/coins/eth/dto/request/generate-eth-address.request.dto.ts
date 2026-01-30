import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EthDerivationRequestDto } from './eth-derivation.request.dto';
import { EthMnemonicRequestDto } from './eth-mnemonic.request.dto';

export class GenerateEthAddressRequestDto {
  @ApiProperty({ type: EthMnemonicRequestDto })
  @ValidateNested()
  @Type(() => EthMnemonicRequestDto)
  mnemonic: EthMnemonicRequestDto;

  @ApiProperty({ type: EthDerivationRequestDto })
  @ValidateNested()
  @Type(() => EthDerivationRequestDto)
  derivation: EthDerivationRequestDto;
}
