import { ApiProperty } from '@nestjs/swagger';

export class EthErc20TransferIntentResponseDto {
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
    example: '60000',
    description: 'Gas limit (decimal)',
  })
  gasLimit: string;

  @ApiProperty({
    example: '0x1111111111111111111111111111111111111111',
    description: 'ERC20 recipient address',
  })
  toAddress: string;

  @ApiProperty({
    example: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    description: 'ERC20 token contract address',
  })
  tokenContract: string;

  @ApiProperty({
    example: '1000000',
    description: 'Token amount in smallest units (decimal)',
  })
  amount: string;
}

export class BuildEthErc20TransferResponseDto {
  @ApiProperty({
    example:
      '0a020801120208001a0208c8220210e0292a2a307861306238363939316336323138623336633164313964346132653965623063653336303665623438320d0a0b1a090a0708a0bcf4c004',
    description: 'Signing payload from build step (hex)',
  })
  payload: string;

  @ApiProperty({ type: EthErc20TransferIntentResponseDto })
  transaction: EthErc20TransferIntentResponseDto;
}
