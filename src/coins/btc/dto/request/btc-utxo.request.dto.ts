import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsHash,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class BtcUtxoRequestDto {
  @ApiProperty({
    example: 'e3c0f7b6a7c9d8e1f2a3b4c5d6e7f8090a1b2c3d4e5f60718293a4b5c6d7e8f9',
    description: 'UTXO transaction id (txid)',
  })
  @IsHash('sha256')
  @IsString()
  @IsNotEmpty()
  txid: string;

  @ApiProperty({ example: 0, description: 'UTXO output index (vout)' })
  @IsInt()
  @Min(0)
  vout: number;

  @ApiProperty({
    example: '10000',
    description: 'UTXO amount in satoshis',
  })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    example: '0014d85c3f9d2c5e7a9f8b7c6d5e4f3a2b1c0d9e8f7',
    description: 'UTXO scriptPubKey in hex',
  })
  @Matches(/^(?:[0-9a-fA-F]{2})+$/)
  @IsString()
  @IsNotEmpty()
  scriptPubKey: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Reverse txid byte order when required',
  })
  @IsOptional()
  @IsBoolean()
  reverseTxId?: boolean;
}
