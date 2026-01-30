import { ApiProperty } from '@nestjs/swagger';

export class BtcAddressDerivationResponseDto {
  @ApiProperty({ example: "m/84'/0'/0'/0/0" })
  path: string;

  @ApiProperty({ example: 84 })
  purpose: number;

  @ApiProperty({ example: 0 })
  coin: number;

  @ApiProperty({ example: 0 })
  account: number;

  @ApiProperty({ example: 0 })
  change: number;

  @ApiProperty({ example: 0 })
  index: number;
}
