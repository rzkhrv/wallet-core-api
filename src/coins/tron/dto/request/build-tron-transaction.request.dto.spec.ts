import { validateSync, type ValidationError } from 'class-validator';
import {
  BuildTronTransactionRequestDto,
  TronTransferType,
} from './build-tron-transaction.request.dto';

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
  it('rejects invalid contract address for trc20', () => {
    const dto: BuildTronTransactionRequestDto =
      new BuildTronTransactionRequestDto();
    dto.transferType = TronTransferType.TRC20;
    dto.ownerAddress = validAddress;
    dto.toAddress = validAddress;
    dto.contractAddress = 'invalid';
    dto.amount = '1';
    const errors: ValidationError[] = validateSync(dto);
    const hasContractError: boolean = errors.some(
      (error: ValidationError) => error.property === 'contractAddress',
    );
    expect(hasContractError).toBe(true);
  });
});
