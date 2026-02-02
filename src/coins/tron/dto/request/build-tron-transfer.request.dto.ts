import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase58,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

const NUMERIC_STRING_REGEX = /^(?:[0-9]+|0[xX][0-9a-fA-F]+)$/;
const BLOCK_ID_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;

export enum TronTransferType {
  TRC10 = 'trc10',
  TRC20 = 'trc20',
}

export class BuildTronTransferRequestDto {
  @ApiProperty({
    example: 'trc20',
    description: 'Transfer type (trc10 or trc20).',
  })
  @IsIn([TronTransferType.TRC10, TronTransferType.TRC20])
  @IsString()
  @IsNotEmpty()
  transferType: TronTransferType;

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
    description:
      'Amount in asset units (trc10/trc20), decimal or 0x-prefixed hex',
  })
  @Matches(NUMERIC_STRING_REGEX)
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
    description: 'Block number (decimal or 0x-prefixed hex)',
  })
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  blockNumber: string;

  @ApiPropertyOptional({
    example: 'USDT',
    description: 'TRC10 asset name (required for trc10 transfers)',
  })
  @ValidateIf(
    (value: BuildTronTransferRequestDto) =>
      value.transferType === TronTransferType.TRC10,
  )
  @IsString()
  @IsNotEmpty()
  assetName?: string;

  @ApiPropertyOptional({
    example: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    description: 'TRC20 contract address (required for trc20 transfers)',
  })
  @ValidateIf(
    (value: BuildTronTransferRequestDto) =>
      value.transferType === TronTransferType.TRC20,
  )
  @IsBase58()
  @Length(34, 34)
  @Matches(/^T/)
  @IsString()
  @IsNotEmpty()
  contractAddress?: string;

  @ApiPropertyOptional({
    example: '0',
    description:
      'TRX call value in SUN (used for trc20 smart contract calls), decimal or 0x-prefixed hex',
  })
  @ValidateIf(
    (value: BuildTronTransferRequestDto) =>
      value.transferType === TronTransferType.TRC20,
  )
  @IsOptional()
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  callValue?: string;

  @ApiPropertyOptional({
    example: '1738253400000',
    description:
      'Transaction timestamp in milliseconds (defaults to now), decimal or 0x-prefixed hex',
  })
  @IsOptional()
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({
    example: '1738253460000',
    description:
      'Transaction expiration in milliseconds (defaults to now + 60s), decimal or 0x-prefixed hex',
  })
  @IsOptional()
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  expiration?: string;

  @ApiPropertyOptional({
    example: '10000000',
    description: 'Fee limit in SUN (decimal or 0x-prefixed hex)',
  })
  @IsOptional()
  @Matches(NUMERIC_STRING_REGEX)
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
