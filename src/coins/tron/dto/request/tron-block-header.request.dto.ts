import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

const DECIMAL_STRING_REGEX = /^[0-9]+$/;
const HEX_32_REGEX = /^[0-9a-fA-F]{64}$/;
const HEX_21_REGEX = /^[0-9a-fA-F]{42}$/;

export class TronBlockHeaderRequestDto {
  @ApiProperty({
    example: '1234567',
    description: 'Block number (decimal)',
  })
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: '0000000000000001f3a1b2c3d4e5f60708090a0b0c0d0e0f1011121314151617',
    description: 'Parent block hash (hex, 32 bytes)',
  })
  @Matches(HEX_32_REGEX)
  @IsString()
  @IsNotEmpty()
  parentHash: string;

  @ApiProperty({
    example: '1111111111111111111111111111111111111111111111111111111111111111',
    description: 'Tx trie root (hex, 32 bytes)',
  })
  @Matches(HEX_32_REGEX)
  @IsString()
  @IsNotEmpty()
  txTrieRoot: string;

  @ApiProperty({
    example: '41f3a1b2c3d4e5f60708090a0b0c0d0e0f10111213',
    description: 'Witness address (hex, 21 bytes)',
  })
  @Matches(HEX_21_REGEX)
  @IsString()
  @IsNotEmpty()
  witnessAddress: string;

  @ApiProperty({
    example: '2',
    description: 'Block version (decimal)',
  })
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    example: '1738253400000',
    description: 'Block timestamp in milliseconds (decimal)',
  })
  @Matches(DECIMAL_STRING_REGEX)
  @IsString()
  @IsNotEmpty()
  timestamp: string;
}
