import { validateSync, type ValidationError } from 'class-validator';
import { BuildTronTransferRequestDto } from './build-tron-transfer.request.dto';

describe('BuildTronTransferRequestDto', () => {
  const validAddress: string = `T${'1'.repeat(33)}`;
  const validBlockHeader = {
    number: '1',
    parentHash: '11'.repeat(32),
    txTrieRoot: '22'.repeat(32),
    witnessAddress: `41${'aa'.repeat(20)}`,
    version: '2',
    timestamp: '1738253400000',
  };
  it('rejects invalid contract address for trc20', () => {
    const dto: BuildTronTransferRequestDto = new BuildTronTransferRequestDto();
    dto.ownerAddress = validAddress;
    dto.toAddress = validAddress;
    dto.blockHeader = validBlockHeader;
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
    const hasBlockHeaderError: boolean = errors.some(
      (error: ValidationError) => error.property === 'blockHeader',
    );
    expect(hasBlockHeaderError).toBe(true);
  });
});
