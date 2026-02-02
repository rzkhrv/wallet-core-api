import { validateSync, type ValidationError } from 'class-validator';
import { BuildTronTransferRequestDto } from './build-tron-transfer.request.dto';

describe('BuildTronTransferRequestDto', () => {
  const validAddress: string = `T${'1'.repeat(33)}`;
  const validBlockId: string = '11'.repeat(32);
  const validBlockNumber: string = '1';
  it('rejects invalid contract address for trc20', () => {
    const dto: BuildTronTransferRequestDto = new BuildTronTransferRequestDto();
    dto.ownerAddress = validAddress;
    dto.toAddress = validAddress;
    dto.blockId = validBlockId;
    dto.blockNumber = validBlockNumber;
    dto.timestamp = '1';
    dto.expiration = '2';
    dto.contractAddress = 'invalid';
    dto.amount = '1';
    const errors: ValidationError[] = validateSync(dto);
    const hasContractError: boolean = errors.some(
      (error: ValidationError) => error.property === 'contractAddress',
    );
    expect(hasContractError).toBe(true);
  });
  it('requires block fields', () => {
    const dto: BuildTronTransferRequestDto = new BuildTronTransferRequestDto();
    dto.ownerAddress = validAddress;
    dto.toAddress = validAddress;
    dto.contractAddress = validAddress;
    dto.amount = '1';
    dto.timestamp = '1';
    dto.expiration = '2';
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
