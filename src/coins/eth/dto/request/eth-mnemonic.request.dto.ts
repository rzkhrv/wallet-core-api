import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EthMnemonicRequestDto {
  @ApiProperty({
    example:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'my-passphrase' })
  @IsOptional()
  @IsString()
  passphrase?: string;
}
