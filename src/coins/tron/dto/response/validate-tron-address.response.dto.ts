import { ApiProperty } from '@nestjs/swagger';

export class ValidateTronAddressResponseDto {
  @ApiProperty({ example: true })
  isValid: boolean;
}
