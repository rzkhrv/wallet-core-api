import { ApiProperty } from '@nestjs/swagger';

export class EthAddressDerivationResponseDto {
  @ApiProperty({ example: "m/44'/60'/0'/0/0" })
  path: string;

  @ApiProperty({ example: 44 })
  purpose: number;

  @ApiProperty({ example: 60 })
  coin: number;

  @ApiProperty({ example: 0 })
  account: number;

  @ApiProperty({ example: 0 })
  change: number;

  @ApiProperty({ example: 0 })
  index: number;
}
