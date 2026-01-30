import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsHash,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class BuildTronTransactionRequestDto {
  @ApiProperty({
    example: '{"visible":true,"txID":"..."}',
    description: 'Raw TRON transaction JSON (from Tron node)',
  })
  @IsJSON()
  @IsString()
  @IsNotEmpty()
  rawJson: string;

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
