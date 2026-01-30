import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MnemonicStrength } from '../../enum/mnemonic-strength.enum';

export class GenerateMnemonicRequestDto {
  @ApiProperty({
    enum: MnemonicStrength,
    example: MnemonicStrength.Bits128,
    description: 'Mnemonic strength in bits',
  })
  @IsEnum(MnemonicStrength)
  strength: MnemonicStrength;

  @ApiPropertyOptional({
    example: 'my-passphrase',
    description: 'Optional BIP39 passphrase',
  })
  @IsOptional()
  @IsString()
  passphrase?: string;
}
