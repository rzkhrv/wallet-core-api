import { validateSync, type ValidationError } from 'class-validator';
import { BuildTronTransactionRequestDto } from './build-tron-transaction.request.dto';

describe('BuildTronTransactionRequestDto', () => {
  const validAddress: string = `T${'1'.repeat(33)}`;
  const validBlockHeader = {
    number: '1',
    parentHash: '11'.repeat(32),
    txTrieRoot: '22'.repeat(32),
    witnessAddress: `41${'aa'.repeat(20)}`,
    version: '2',
    timestamp: '1738253400000',
  };
  it('rejects invalid owner address', () => {
    const dto: BuildTronTransactionRequestDto =
      new BuildTronTransactionRequestDto();
    dto.ownerAddress = 'invalid';
    dto.toAddress = validAddress;
    dto.amount = '1';
    dto.blockHeader = validBlockHeader;
    dto.timestamp = '1';
    dto.expiration = '2';
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
    dto.timestamp = '1';
    dto.expiration = '2';
    const errors: ValidationError[] = validateSync(dto);
    const hasBlockHeaderError: boolean = errors.some(
      (error: ValidationError) => error.property === 'blockHeader',
    );
    expect(hasBlockHeaderError).toBe(true);
  });
});
