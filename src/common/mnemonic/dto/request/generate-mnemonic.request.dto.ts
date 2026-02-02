import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { MnemonicStrength } from '../../enum/mnemonic-strength.enum';

const MNEMONIC_STRENGTH_VALUES: MnemonicStrength[] = Object.values(
  MnemonicStrength,
).filter((value): value is MnemonicStrength => typeof value === 'number');

export class GenerateMnemonicRequestDto {
  @ApiProperty({
    enum: MnemonicStrength,
    example: MnemonicStrength.Bits128,
    description: 'Mnemonic strength in bits',
  })
  @IsInt()
  @IsIn(MNEMONIC_STRENGTH_VALUES)
  strength: MnemonicStrength;

  @ApiPropertyOptional({
    example: 'my-passphrase',
    description: 'Optional BIP39 passphrase',
  })
  @IsOptional()
  @IsString()
  passphrase?: string;
}
