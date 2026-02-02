import { validateSync, type ValidationError } from 'class-validator';
import { BuildTronTransactionRequestDto } from './build-tron-transaction.request.dto';

describe('BuildTronTransactionRequestDto', () => {
  const validAddress: string = `T${'1'.repeat(33)}`;
  const validBlockId: string = '11'.repeat(32);
  const validBlockNumber: string = '1';
  it('rejects invalid owner address', () => {
    const dto: BuildTronTransactionRequestDto =
      new BuildTronTransactionRequestDto();
    dto.ownerAddress = 'invalid';
    dto.toAddress = validAddress;
    dto.amount = '1';
    dto.blockId = validBlockId;
    dto.blockNumber = validBlockNumber;
    const errors: ValidationError[] = validateSync(dto);
    const hasOwnerError: boolean = errors.some(
      (error: ValidationError) => error.property === 'ownerAddress',
    );
    expect(hasOwnerError).toBe(true);
  });

  it('requires block fields', () => {
    const dto: BuildTronTransactionRequestDto =
      new BuildTronTransactionRequestDto();
    dto.ownerAddress = validAddress;
    dto.toAddress = validAddress;
    dto.amount = '1';
    dto.blockId = '';
    dto.blockNumber = '';
    const errors: ValidationError[] = validateSync(dto);
    const hasBlockIdError: boolean = errors.some(
      (error: ValidationError) => error.property === 'blockId',
    );
    const hasBlockNumberError: boolean = errors.some(
      (error: ValidationError) => error.property === 'blockNumber',
    );
    expect(hasBlockIdError).toBe(true);
    expect(hasBlockNumberError).toBe(true);
  });
});
