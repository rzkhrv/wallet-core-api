import { ApiProperty } from '@nestjs/swagger';
import { IsBtcAddress, IsNotEmpty, IsString } from 'class-validator';

export class ValidateBtcAddressRequestDto {
  @ApiProperty({
    example: 'bc1qw4hrw0v2k0w8m7yr9q4r6v2x8e6jzndt3x8l2h',
    description: 'BTC address to validate',
  })
  @IsBtcAddress()
  @IsString()
  @IsNotEmpty()
  address: string;
}
