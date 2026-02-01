import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsHash,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SignTronRawTransactionRequestDto {
  @ApiProperty({
    example:
      '0x7b227472616e73666572223a7b226f776e657241646472657373223a222e2e2e227d7d',
    description: 'Signing payload from build step (hex-encoded UTF-8 raw JSON)',
  })
  @Matches(/^(0x)?([0-9a-fA-F]{2})+$/)
  @IsString()
  @IsNotEmpty()
  payload: string;

  @ApiProperty({
    example: '6cddce8e6d38c6d2f5c9b2f1f2c9b8e4e5f6a7b8c9d0e1f2a3b4c5d6e7f8090',
    description: 'Signer private key (hex)',
  })
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/)
  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @ApiPropertyOptional({
    example: 'f3a1b2c3d4e5f6...',
    description: 'Optional transaction id',
  })
  @IsOptional()
  @IsHash('sha256')
  @IsString()
  txId?: string;
}
