import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBase58,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { TronBlockHeaderRequestDto } from './tron-block-header.request.dto';

const DECIMAL_STRING_REGEX = /^[0-9]+$/;

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
    type: TronBlockHeaderRequestDto,
    description: 'Block header fields for TAPOS-safe ref_block_hash derivation',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => TronBlockHeaderRequestDto)
  blockHeader: TronBlockHeaderRequestDto;

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
