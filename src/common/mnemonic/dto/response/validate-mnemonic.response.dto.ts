import { ApiProperty } from '@nestjs/swagger';

export class ValidateMnemonicResponseDto {
  @ApiProperty({ example: true })
  isValid: boolean;
}
