import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

const NUMERIC_STRING_REGEX = /^(?:[0-9]+|0[xX][0-9a-fA-F]+)$/;

export class BuildEthErc20TransferRequestDto {
  @ApiProperty({
    example: '1',
    description: 'Ethereum chain id (decimal or 0x-prefixed hex)',
  })
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  chainId: string;

  @ApiProperty({
    example: '0',
    description: 'Transaction nonce (decimal or 0x-prefixed hex)',
  })
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({
    example: '20000000000',
    description: 'Gas price in wei (decimal or 0x-prefixed hex)',
  })
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  gasPrice: string;

  @ApiProperty({
    example: '60000',
    description: 'Gas limit (decimal or 0x-prefixed hex)',
  })
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  gasLimit: string;

  @ApiProperty({
    example: '0x1111111111111111111111111111111111111111',
    description: 'ERC20 recipient address',
  })
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({
    example: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    description: 'ERC20 token contract address',
  })
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  tokenContract: string;

  @ApiProperty({
    example: '1000000',
    description: 'Token amount in smallest units (decimal or 0x-prefixed hex)',
  })
  @Matches(NUMERIC_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  amount: string;
}
