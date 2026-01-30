import { ApiProperty } from '@nestjs/swagger';
import { EthAddressDerivationResponseDto } from './eth-address-derivation.response.dto';
import { EthAddressKeysResponseDto } from './eth-address-keys.response.dto';

export class GenerateEthAddressResponseDto {
  @ApiProperty({ example: '0x1111111111111111111111111111111111111111' })
  address: string;

  @ApiProperty({ type: EthAddressKeysResponseDto })
  keys: EthAddressKeysResponseDto;

  @ApiProperty({ type: EthAddressDerivationResponseDto })
  derivation: EthAddressDerivationResponseDto;
}
