import { validateSync, type ValidationError } from 'class-validator';
import { BuildTronTransactionRequestDto } from './build-tron-transaction.request.dto';

describe('BuildTronTransactionRequestDto', () => {
  const validAddress: string = `T${'1'.repeat(33)}`;
  it('rejects invalid owner address', () => {
    const dto: BuildTronTransactionRequestDto =
      new BuildTronTransactionRequestDto();
    dto.ownerAddress = 'invalid';
    dto.toAddress = validAddress;
    dto.amount = '1';
    const errors: ValidationError[] = validateSync(dto);
    const hasOwnerError: boolean = errors.some(
      (error: ValidationError) => error.property === 'ownerAddress',
    );
    expect(hasOwnerError).toBe(true);
  });
});
