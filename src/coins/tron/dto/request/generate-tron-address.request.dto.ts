import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TronDerivationRequestDto } from './tron-derivation.request.dto';
import { TronMnemonicRequestDto } from './tron-mnemonic.request.dto';

export class GenerateTronAddressRequestDto {
  @ApiProperty({ type: TronMnemonicRequestDto })
  @ValidateNested()
  @Type(() => TronMnemonicRequestDto)
  mnemonic: TronMnemonicRequestDto;

  @ApiProperty({ type: TronDerivationRequestDto })
  @ValidateNested()
  @Type(() => TronDerivationRequestDto)
  derivation: TronDerivationRequestDto;
}
