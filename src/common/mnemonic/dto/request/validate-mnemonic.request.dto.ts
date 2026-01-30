import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ValidateMnemonicRequestDto {
  @ApiProperty({
    example:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    description: 'Mnemonic phrase to validate',
  })
  @IsString()
  @IsNotEmpty()
  mnemonic: string;

  @ApiPropertyOptional({
    example: 'my-passphrase',
    description: 'Optional BIP39 passphrase',
  })
  @IsOptional()
  @IsString()
  passphrase?: string;
}
