import { ApiProperty } from '@nestjs/swagger';

export class GenerateMnemonicResponseDto {
  @ApiProperty({
    example:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  })
  mnemonic: string;

  @ApiProperty({ example: true })
  isPassphraseUsed: boolean;

  @ApiProperty({ example: 128 })
  strengthBits: number;
}
