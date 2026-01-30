import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export class BuildEthErc20TransferRequestDto {
  @ApiProperty({ example: '1' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  chainId: string;

  @ApiProperty({ example: '0' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({ example: '20000000000' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  gasPrice: string;

  @ApiProperty({ example: '60000' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  gasLimit: string;

  @ApiProperty({ example: '0x1111111111111111111111111111111111111111' })
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({ example: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' })
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  tokenContract: string;

  @ApiProperty({ example: '1000000' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    example: '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
  })
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/)
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
