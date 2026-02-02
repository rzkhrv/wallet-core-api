import { validateSync, type ValidationError } from 'class-validator';
import { GenerateMnemonicRequestDto } from './generate-mnemonic.request.dto';
import { MnemonicStrength } from '../../enum/mnemonic-strength.enum';

describe('GenerateMnemonicRequestDto', () => {
  it('rejects enum key strength values', () => {
    const dto: GenerateMnemonicRequestDto = new GenerateMnemonicRequestDto();
    dto.strength = 'Bits128' as unknown as MnemonicStrength;
    const errors: ValidationError[] = validateSync(dto);
    const hasStrengthError: boolean = errors.some(
      (error: ValidationError) => error.property === 'strength',
    );
    expect(hasStrengthError).toBe(true);
  });

  it('accepts numeric strength values', () => {
    const dto: GenerateMnemonicRequestDto = new GenerateMnemonicRequestDto();
    dto.strength = MnemonicStrength.Bits128;
    const errors: ValidationError[] = validateSync(dto);
    expect(errors.length).toBe(0);
  });
});
