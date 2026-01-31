import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum TronTransferType {
  TRX = 'trx',
  TRC10 = 'trc10',
}

export class BuildTronTransactionRequestDto {
  @ApiPropertyOptional({
    example: 'trx',
    description: 'Transfer type (trx or trc10). Defaults to trx.',
  })
  @IsOptional()
  @IsIn([TronTransferType.TRX, TronTransferType.TRC10])
  transferType?: TronTransferType;

  @ApiProperty({
    example: 'TLyqzVGLV1srkB7dToTAqVwC6L3w1V3U2p',
    description: 'Sender TRON address',
  })
  @IsString()
  @IsNotEmpty()
  ownerAddress: string;

  @ApiProperty({
    example: 'TXNYZ9b8F8V5Ms5d9cPa9Z4D3W4vJ9rY6n',
    description: 'Recipient TRON address',
  })
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({
    example: '1000000',
    description: 'Amount in SUN (trx) or asset units (trc10)',
  })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiPropertyOptional({
    example: 'USDT',
    description: 'TRC10 asset name (required for trc10 transfers)',
  })
  @ValidateIf(
    (value: BuildTronTransactionRequestDto) =>
      (value.transferType ?? TronTransferType.TRX) === TronTransferType.TRC10,
  )
  @IsString()
  @IsNotEmpty()
  assetName?: string;

  @ApiPropertyOptional({
    example: '1738253400000',
    description: 'Transaction timestamp in milliseconds (defaults to now)',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({
    example: '1738253460000',
    description:
      'Transaction expiration in milliseconds (defaults to now + 60s)',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @IsString()
  expiration?: string;

  @ApiPropertyOptional({
    example: '10000000',
    description: 'Fee limit in SUN',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
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
