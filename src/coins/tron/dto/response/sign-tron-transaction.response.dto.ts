import { ApiProperty } from '@nestjs/swagger';

export class SignTronTransactionResponseDto {
  @ApiProperty({ example: 'f3a1b2c3d4e5f6...' })
  txId: string;

  @ApiProperty({ example: 'aabbccddeeff...' })
  signature: string;

  @ApiProperty({ example: '1a2b' })
  refBlockBytes: string;

  @ApiProperty({ example: 'a1b2c3d4' })
  refBlockHash: string;

  @ApiProperty({ example: '{"signature":["..."],"raw_data":{...}}' })
  signedJson: string;
}
