import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBtcAddress,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BtcUtxoRequestDto } from './btc-utxo.request.dto';

export class BuildBtcTransactionRequestDto {
  @ApiProperty({
    example: 'bc1qw4hrw0v2k0w8m7yr9q4r6v2x8e6jzndt3x8l2h',
    description: 'Recipient BTC address',
  })
  @IsBtcAddress()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({
    example: 'bc1q2l3m4n5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e',
    description: 'Change BTC address',
  })
  @IsBtcAddress()
  @IsString()
  @IsNotEmpty()
  changeAddress: string;

  @ApiProperty({
    example: '10000',
    description: 'Amount to send in satoshis',
  })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ example: '10', description: 'Fee per byte in satoshis' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  byteFee: string;

  @ApiProperty({
    type: [BtcUtxoRequestDto],
    description: 'List of UTXOs to spend',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BtcUtxoRequestDto)
  utxos: BtcUtxoRequestDto[];

  @ApiPropertyOptional({
    example: 1,
    description: 'Optional SIGHASH type',
  })
  @IsOptional()
  @IsInt()
  hashType?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Spend maximum available amount',
  })
  @IsOptional()
  @IsBoolean()
  useMaxAmount?: boolean;
}
