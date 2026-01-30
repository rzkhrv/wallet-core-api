import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class SignBtcTransactionRequestDto {
  @ApiProperty({
    example:
      '0a1e6263317177346872773076326b3077386d37797239713472367632783865366a7a6e64743378386c3268121e62633171326c336d346e3570367137723873397430753176327733783479357a366137623863396430651a04e8032201302a360a210a2000000000000000000000000000000000000000000000000000000000000000001001200',
    description: 'Signing payload from build step (hex)',
  })
  @Matches(/^(0x)?([0-9a-fA-F]{2})+$/)
  @IsString()
  @IsNotEmpty()
  payload: string;

  @ApiProperty({
    example: [
      'e8f32e723decf4051aefac8e2c3b1f9d9ad7a2b9f19e0f8f6a2b3c4d5e6f7081',
    ],
    description: 'Private keys for the provided UTXOs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/, { each: true })
  @IsString({ each: true })
  privateKeys: string[];
}
