import { ApiProperty } from '@nestjs/swagger';

export class ValidateEthAddressResponseDto {
  @ApiProperty({ example: true })
  isValid: boolean;
}
