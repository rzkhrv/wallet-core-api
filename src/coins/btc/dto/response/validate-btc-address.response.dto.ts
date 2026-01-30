import { ApiProperty } from '@nestjs/swagger';

export class ValidateBtcAddressResponseDto {
  @ApiProperty({ example: true })
  isValid: boolean;
}
