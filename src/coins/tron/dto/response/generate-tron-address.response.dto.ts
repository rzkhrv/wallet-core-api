import { ApiProperty } from '@nestjs/swagger';
import { TronAddressDerivationResponseDto } from './tron-address-derivation.response.dto';
import { TronAddressKeysResponseDto } from './tron-address-keys.response.dto';

export class GenerateTronAddressResponseDto {
  @ApiProperty({ example: 'TQJ8YqK9m5frpB1bYwQZ8VJ2G2R9o2k5G6' })
  address: string;

  @ApiProperty({ type: TronAddressKeysResponseDto })
  keys: TronAddressKeysResponseDto;

  @ApiProperty({ type: TronAddressDerivationResponseDto })
  derivation: TronAddressDerivationResponseDto;
}
