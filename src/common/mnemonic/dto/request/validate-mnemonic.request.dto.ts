import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ValidateMnemonicRequestDto {
  @ApiProperty({
    example:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  })
  @IsString()
  @IsNotEmpty()
  mnemonic: string;

  @ApiPropertyOptional({ example: 'my-passphrase' })
  @IsOptional()
  @IsString()
  passphrase?: string;
}
