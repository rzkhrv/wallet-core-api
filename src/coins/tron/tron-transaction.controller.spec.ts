import { Test, TestingModule } from '@nestjs/testing';
import { TronTransactionController } from './tron-transaction.controller';
import { TronTransactionService } from './service/tron-transaction.service';
import type { BuildTronTransactionRequestDto } from './dto/request/build-tron-transaction.request.dto';
import type { BuildTronTransferRequestDto } from './dto/request/build-tron-transfer.request.dto';
import type { SignTronTransactionRequestDto } from './dto/request/sign-tron-transaction.request.dto';
import type { BuildTronTransactionResponseDto } from './dto/response/build-tron-transaction.response.dto';
import type { SignTronTransactionResponseDto } from './dto/response/sign-tron-transaction.response.dto';

describe('TronTransactionController', () => {
  let controller: TronTransactionController;
  let service: {
    buildTransaction: jest.Mock;
    buildTransfer: jest.Mock;
    sign: jest.Mock;
  };
  const buildResponse: BuildTronTransactionResponseDto = {
    payload: '0x0a0200002208',
    transaction: {
      type: 'trx',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
      timestamp: '1',
      expiration: '2',
      feeLimit: null,
      memo: null,
    },
  };
  const signResponse: SignTronTransactionResponseDto = {
    txId: 'txid',
    signature: 'sig',
    refBlockBytes: 'aa',
    refBlockHash: 'bb',
    rawDataHex: 'cc',
    signedJson: '{}',
    visible: false,
  };
  const blockHeader = {
    number: '1',
    parentHash: '11'.repeat(32),
    txTrieRoot: '22'.repeat(32),
    witnessAddress: `41${'aa'.repeat(20)}`,
    version: '2',
    timestamp: '1738253400000',
  };
  beforeEach(async () => {
    service = {
      buildTransaction: jest.fn().mockReturnValue(buildResponse),
      buildTransfer: jest.fn().mockReturnValue(buildResponse),
      sign: jest.fn().mockReturnValue(signResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TronTransactionController],
      providers: [
        {
          provide: TronTransactionService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<TronTransactionController>(
      TronTransactionController,
    );
  });

  it('delegates build transfer', () => {
    const body: BuildTronTransferRequestDto = {
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      contractAddress: 'TCONTRACT',
      amount: '1',
      blockHeader,
      timestamp: '1000',
      expiration: '2000',
      feeLimit: '10000000',
      callValue: '0',
    };
    const result = controller.buildTransfer(body);
    expect(service.buildTransfer).toHaveBeenCalledWith(body);
    expect(result).toBe(buildResponse);
  });

  it('delegates build transaction', () => {
    const body: BuildTronTransactionRequestDto = {
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
      blockHeader,
      timestamp: '1000',
      expiration: '2000',
    };
    const result = controller.buildTransaction(body);
    expect(service.buildTransaction).toHaveBeenCalledWith(body);
    expect(result).toBe(buildResponse);
  });

  it('delegates sign transaction', () => {
    const body: SignTronTransactionRequestDto = {
      payload: '0x0a0200002208',
      privateKey: '00'.repeat(32),
    };
    const result = controller.sign(body);
    expect(service.sign).toHaveBeenCalledWith(body);
    expect(result).toBe(signResponse);
  });
});
