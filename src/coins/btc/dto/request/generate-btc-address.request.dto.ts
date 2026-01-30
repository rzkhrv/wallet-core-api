import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BtcDerivationRequestDto } from './btc-derivation.request.dto';
import { BtcMnemonicRequestDto } from './btc-mnemonic.request.dto';

export class GenerateBtcAddressRequestDto {
  @ApiProperty({ type: BtcMnemonicRequestDto })
  @ValidateNested()
  @Type(() => BtcMnemonicRequestDto)
  mnemonic: BtcMnemonicRequestDto;

  @ApiProperty({ type: BtcDerivationRequestDto })
  @ValidateNested()
  @Type(() => BtcDerivationRequestDto)
  derivation: BtcDerivationRequestDto;
}
