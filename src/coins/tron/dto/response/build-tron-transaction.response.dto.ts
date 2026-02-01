import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TronTransactionIntentResponseDto {
  @ApiProperty({
    example: 'trx',
    description: 'TRON transaction type (trx, trc10, trc20)',
  })
  type: string;

  @ApiProperty({
    example: 'TLyqzVGLV1srkB7dToTAqVwC6L3w1V3U2p',
    description: 'Sender TRON address',
  })
  ownerAddress: string;

  @ApiProperty({
    example: 'TXNYZ9b8F8V5Ms5d9cPa9Z4D3W4vJ9rY6n',
    description: 'Recipient TRON address',
  })
  toAddress: string;

  @ApiProperty({
    example: '1000000',
    description: 'Amount in smallest units (decimal)',
  })
  amount: string;

  @ApiPropertyOptional({
    example: 'USDT',
    description: 'TRC10 asset name',
  })
  assetName?: string;

  @ApiPropertyOptional({
    example: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    description: 'TRC20 contract address',
  })
  contractAddress?: string;

  @ApiPropertyOptional({
    example: '0',
    description: 'TRX call value in SUN (decimal)',
  })
  callValue?: string;

  @ApiProperty({
    example: '1738253400000',
    description: 'Transaction timestamp in milliseconds (decimal)',
  })
  timestamp: string;

  @ApiProperty({
    example: '1738253460000',
    description: 'Transaction expiration in milliseconds (decimal)',
  })
  expiration: string;

  @ApiPropertyOptional({
    example: '10000000',
    description: 'Fee limit in SUN (decimal)',
    nullable: true,
  })
  feeLimit?: string | null;

  @ApiPropertyOptional({
    example: 'Invoice #42',
    description: 'Optional memo',
    nullable: true,
  })
  memo?: string | null;
}

export class BuildTronTransactionResponseDto {
  @ApiProperty({
    example:
      '0x7b227472616e73666572223a7b226f776e657241646472657373223a222e2e2e222c22746f41646472657373223a222e2e2e222c22616d6f756e74223a2231227d2c2274696d657374616d70223a2231373338323533343030303030222c2265787069726174696f6e223a2231373338323533343630303030227d',
    description: 'Signing payload from build step (hex-encoded UTF-8 raw JSON)',
  })
  payload: string;

  @ApiProperty({ type: TronTransactionIntentResponseDto })
  transaction: TronTransactionIntentResponseDto;
}
