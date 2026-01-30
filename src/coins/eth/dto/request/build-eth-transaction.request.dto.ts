import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class BuildEthTransactionRequestDto {
  @ApiProperty({ example: '1', description: 'Ethereum chain id' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  chainId: string;

  @ApiProperty({ example: '0', description: 'Transaction nonce' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({
    example: '20000000000',
    description: 'Gas price in wei',
  })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  gasPrice: string;

  @ApiProperty({ example: '21000', description: 'Gas limit' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  gasLimit: string;

  @ApiProperty({
    example: '0x1111111111111111111111111111111111111111',
    description: 'Recipient ETH address',
  })
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({
    example: '1000000000000000',
    description: 'Amount in wei',
  })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount: string;
}
