import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase58,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

const DECIMAL_STRING_REGEX = /^[0-9]+$/;
const BLOCK_ID_REGEX = /^[0-9a-fA-F]{64}$/;

export class BuildTronTransactionRequestDto {
  @ApiProperty({
    example: 'TLyqzVGLV1srkB7dToTAqVwC6L3w1V3U2p',
    description: 'Sender TRON address',
  })
  @IsBase58()
  @Length(34, 34)
  @Matches(/^T/)
  @IsString()
  @IsNotEmpty()
  ownerAddress: string;

  @ApiProperty({
    example: 'TXNYZ9b8F8V5Ms5d9cPa9Z4D3W4vJ9rY6n',
    description: 'Recipient TRON address',
  })
  @IsBase58()
  @Length(34, 34)
  @Matches(/^T/)
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({
    example: '1000000',
    description: 'Amount in SUN (decimal)',
  })
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    example: '0000000000000001f3a1b2c3d4e5f60708090a0b0c0d0e0f1011121314151617',
    description: 'Block ID (hex, 32 bytes)',
  })
  @Matches(BLOCK_ID_REGEX)
  @IsString()
  @IsNotEmpty()
  blockId: string;

  @ApiProperty({
    example: '1234567',
    description: 'Block number (decimal)',
  })
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  blockNumber: string;

  @ApiPropertyOptional({
    example: '1738253400000',
    description:
      'Transaction timestamp in milliseconds (decimal, defaults to now)',
  })
  @IsOptional()
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({
    example: '1738253460000',
    description:
      'Transaction expiration in milliseconds (decimal, defaults to now + 60s)',
  })
  @IsOptional()
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  expiration?: string;

  @ApiPropertyOptional({
    example: '10000000',
    description: 'Fee limit in SUN (decimal)',
  })
  @IsOptional()
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  feeLimit?: string;

  @ApiPropertyOptional({
    example: 'Invoice #42',
    description: 'Optional memo',
  })
  @IsOptional()
  @IsString()
  memo?: string;
}
