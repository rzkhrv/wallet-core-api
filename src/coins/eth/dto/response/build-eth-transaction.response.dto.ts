import { ApiProperty } from '@nestjs/swagger';

export class EthTransactionIntentResponseDto {
  @ApiProperty({
    example: '1',
    description: 'Ethereum chain id (decimal)',
  })
  chainId: string;

  @ApiProperty({
    example: '0',
    description: 'Transaction nonce (decimal)',
  })
  nonce: string;

  @ApiProperty({
    example: '20000000000',
    description: 'Gas price in wei (decimal)',
  })
  gasPrice: string;

  @ApiProperty({
    example: '21000',
    description: 'Gas limit (decimal)',
  })
  gasLimit: string;

  @ApiProperty({
    example: '0x1111111111111111111111111111111111111111',
    description: 'Recipient ETH address',
  })
  toAddress: string;

  @ApiProperty({
    example: '1000000000000000',
    description: 'Amount in wei (decimal)',
  })
  amount: string;
}

export class BuildEthTransactionResponseDto {
  @ApiProperty({
    example:
      '0a020801120208001a0208c8220210e0292a2a3078313131313131313131313131313131313131313131313131313131313131313131313131313131320b0a090a0708f0cba1f4c004',
    description: 'Signing payload from build step (hex)',
  })
  payload: string;

  @ApiProperty({ type: EthTransactionIntentResponseDto })
  transaction: EthTransactionIntentResponseDto;
}
