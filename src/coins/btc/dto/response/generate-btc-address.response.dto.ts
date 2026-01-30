import { ApiProperty } from '@nestjs/swagger';
import { BtcAddressDerivationResponseDto } from './btc-address-derivation.response.dto';
import { BtcAddressKeysResponseDto } from './btc-address-keys.response.dto';

export class GenerateBtcAddressResponseDto {
  @ApiProperty({ example: 'bc1qw4hrw0v2k0w8m7yr9q4r6v2x8e6jzndt3x8l2h' })
  address: string;

  @ApiProperty({ type: BtcAddressKeysResponseDto })
  keys: BtcAddressKeysResponseDto;

  @ApiProperty({ type: BtcAddressDerivationResponseDto })
  derivation: BtcAddressDerivationResponseDto;
}
