import { Test, TestingModule } from '@nestjs/testing';
import { EthTransactionController } from './eth-transaction.controller';
import { EthTransactionService } from './service/eth-transaction.service';
import type { BuildEthTransactionRequestDto } from './dto/request/build-eth-transaction.request.dto';
import type { BuildEthErc20TransferRequestDto } from './dto/request/build-eth-erc20-transfer.request.dto';
import type { SignEthTransactionRequestDto } from './dto/request/sign-eth-transaction.request.dto';
import type { BuildEthTransactionResponseDto } from './dto/response/build-eth-transaction.response.dto';
import type { BuildEthErc20TransferResponseDto } from './dto/response/build-eth-erc20-transfer.response.dto';
import type { SignEthTransactionResponseDto } from './dto/response/sign-eth-transaction.response.dto';

describe('EthTransactionController', () => {
  let controller: EthTransactionController;
  let service: {
    buildTransaction: jest.Mock;
    buildTransfer: jest.Mock;
    sign: jest.Mock;
  };
  const buildResponse: BuildEthTransactionResponseDto = {
    payload: 'deadbeef',
  };
  const transferResponse: BuildEthErc20TransferResponseDto = {
    payload: 'cafebabe',
  };
  const signResponse: SignEthTransactionResponseDto = {
    rawTx: 'raw',
    preHash: 'hash',
    data: 'data',
    signature: { v: '1b', r: '00', s: '01' },
  };
  beforeEach(async () => {
    service = {
      buildTransaction: jest.fn().mockReturnValue(buildResponse),
      buildTransfer: jest.fn().mockReturnValue(transferResponse),
      sign: jest.fn().mockReturnValue(signResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthTransactionController],
      providers: [
        {
          provide: EthTransactionService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<EthTransactionController>(EthTransactionController);
  });

  it('delegates build transaction', () => {
    const body: BuildEthTransactionRequestDto = {
      chainId: '1',
      nonce: '0',
      gasPrice: '1',
      gasLimit: '21000',
      toAddress: '0xabc',
      amount: '1',
    };
    const result = controller.buildTransaction(body);
    expect(service.buildTransaction).toHaveBeenCalledWith(body);
    expect(result).toBe(buildResponse);
  });

  it('delegates build transfer', () => {
    const body: BuildEthErc20TransferRequestDto = {
      chainId: '1',
      nonce: '0',
      gasPrice: '1',
      gasLimit: '60000',
      toAddress: '0xabc',
      tokenContract: '0xdef',
      amount: '1',
    };
    const result = controller.buildTransfer(body);
    expect(service.buildTransfer).toHaveBeenCalledWith(body);
    expect(result).toBe(transferResponse);
  });

  it('delegates sign transaction', () => {
    const body: SignEthTransactionRequestDto = {
      payload: 'deadbeef',
      privateKey: '00'.repeat(32),
    };
    const result = controller.sign(body);
    expect(service.sign).toHaveBeenCalledWith(body);
    expect(result).toBe(signResponse);
  });
});
