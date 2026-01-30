import { ApiProperty } from '@nestjs/swagger';

export class TronAddressDerivationResponseDto {
  @ApiProperty({ example: "m/44'/195'/0'/0/0" })
  path: string;

  @ApiProperty({ example: 44 })
  purpose: number;

  @ApiProperty({ example: 195 })
  coin: number;

  @ApiProperty({ example: 0 })
  account: number;

  @ApiProperty({ example: 0 })
  change: number;

  @ApiProperty({ example: 0 })
  index: number;
}
