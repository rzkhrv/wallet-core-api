import { ApiProperty } from '@nestjs/swagger';

export class EthTransactionSignatureResponseDto {
  @ApiProperty({ example: '1b' })
  v: string;

  @ApiProperty({
    example: '5e1d3a76fbf824220e64d1e86e1b5e2b6e41f4c4f83d1d56f4f0a2b9d1a3e0d0',
  })
  r: string;

  @ApiProperty({
    example: '4b3f1b1d6e5a7c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7081920a1b2c3d4e5f6',
  })
  s: string;
}
