import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BtcDerivationRequestDto } from './btc-derivation.request.dto';
import { BtcMnemonicRequestDto } from './btc-mnemonic.request.dto';

export class GenerateBtcAddressRequestDto {
  @ApiProperty({
    type: BtcMnemonicRequestDto,
    description: 'Mnemonic input for key derivation',
  })
  @ValidateNested()
  @Type(() => BtcMnemonicRequestDto)
  mnemonic: BtcMnemonicRequestDto;

  @ApiProperty({
    type: BtcDerivationRequestDto,
    description: 'Derivation path parameters',
  })
  @ValidateNested()
  @Type(() => BtcDerivationRequestDto)
  derivation: BtcDerivationRequestDto;
}
