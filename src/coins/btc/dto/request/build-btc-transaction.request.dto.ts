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
  Matches,
  ValidateNested,
} from 'class-validator';
import { BtcUtxoRequestDto } from './btc-utxo.request.dto';

export class BuildBtcTransactionRequestDto {
  @ApiProperty({ example: 'bc1qw4hrw0v2k0w8m7yr9q4r6v2x8e6jzndt3x8l2h' })
  @IsBtcAddress()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({ example: 'bc1q2l3m4n5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e' })
  @IsBtcAddress()
  @IsString()
  @IsNotEmpty()
  changeAddress: string;

  @ApiProperty({ example: '10000' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ example: '10' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  byteFee: string;

  @ApiProperty({ type: [BtcUtxoRequestDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BtcUtxoRequestDto)
  utxos: BtcUtxoRequestDto[];

  @ApiProperty({
    example: [
      'e8f32e723decf4051aefac8e2c3b1f9d9ad7a2b9f19e0f8f6a2b3c4d5e6f7081',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/, { each: true })
  @IsString({ each: true })
  privateKeys: string[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  hashType?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  useMaxAmount?: boolean;
}
