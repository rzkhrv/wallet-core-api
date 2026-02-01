import { validateSync, type ValidationError } from 'class-validator';
import {
  BuildTronTransferRequestDto,
  TronTransferType,
} from './build-tron-transfer.request.dto';

describe('BuildTronTransferRequestDto', () => {
  const validAddress: string = `T${'1'.repeat(33)}`;
  it('rejects invalid contract address for trc20', () => {
    const dto: BuildTronTransferRequestDto = new BuildTronTransferRequestDto();
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
  it('requires asset name for trc10', () => {
    const dto: BuildTronTransferRequestDto = new BuildTronTransferRequestDto();
    dto.transferType = TronTransferType.TRC10;
    dto.ownerAddress = validAddress;
    dto.toAddress = validAddress;
    dto.amount = '1';
    const errors: ValidationError[] = validateSync(dto);
    const hasAssetError: boolean = errors.some(
      (error: ValidationError) => error.property === 'assetName',
    );
    expect(hasAssetError).toBe(true);
  });
});
