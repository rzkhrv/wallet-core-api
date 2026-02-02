import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TronTransactionIntentResponseDto {
  @ApiProperty({
    example: 'trx',
    description: 'TRON transaction type (trx, trc20)',
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
    example: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    description: 'TRC20 contract address',
  })
  contractAddress?: string;

  @ApiPropertyOptional({
    example: '0',
    description: 'TRX call value in SUN (decimal)',
    nullable: true,
  })
  callValue?: string | null;

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
    example: '0x0a0200002208...',
    description:
      'Signing payload from build step (hex-encoded Wallet-Core SigningInput)',
  })
  payload: string;

  @ApiProperty({ type: TronTransactionIntentResponseDto })
  transaction: TronTransactionIntentResponseDto;
}
