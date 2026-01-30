import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TronMnemonicRequestDto {
  @ApiProperty({
    example:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    description: 'BIP39 mnemonic phrase',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({
    example: 'my-passphrase',
    description: 'Optional BIP39 passphrase',
  })
  @IsOptional()
  @IsString()
  passphrase?: string;
}
