import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBtcAddress,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class BtcOutputRequestDto {
  @ApiProperty({
    example: 'bc1qw4hrw0v2k0w8m7yr9q4r6v2x8e6jzndt3x8l2h',
    description: 'Output BTC address (recipient or change)',
  })
  @IsBtcAddress()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    example: '10000',
    description:
      'Amount in satoshis (required for recipient outputs, ignored for change)',
  })
  @ValidateIf((value: BtcOutputRequestDto) => !value.isChange)
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  amount?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Marks this output as the change address',
  })
  @IsOptional()
  @IsBoolean()
  isChange?: boolean;
}
