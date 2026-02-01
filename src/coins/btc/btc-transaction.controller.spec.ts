import { Test, TestingModule } from '@nestjs/testing';
import { BtcTransactionController } from './btc-transaction.controller';
import { BtcTransactionService } from './service/btc-transaction.service';
import type { BuildBtcTransactionRequestDto } from './dto/request/build-btc-transaction.request.dto';
import type { SignBtcTransactionRequestDto } from './dto/request/sign-btc-transaction.request.dto';
import type { BuildBtcTransactionResponseDto } from './dto/response/build-btc-transaction.response.dto';
import type { SignBtcTransactionResponseDto } from './dto/response/sign-btc-transaction.response.dto';

describe('BtcTransactionController', () => {
  let controller: BtcTransactionController;
  let service: { buildTransaction: jest.Mock; sign: jest.Mock };
  const buildResponse: BuildBtcTransactionResponseDto = {
    payload: 'deadbeef',
    transaction: {
      toAddress: 'bc1qtest',
      changeAddress: 'bc1qtest',
      amount: '1000',
      byteFee: '1',
      utxos: [
        {
          txid: 'a'.repeat(64),
          vout: 0,
          amount: '2000',
          scriptPubKey: 'ABQ=',
          reverseTxId: false,
        },
      ],
      hashType: 1,
      useMaxAmount: false,
      plan: {
        amount: '1000',
        availableAmount: '2000',
        fee: '10',
        change: '990',
      },
    },
  };
  const signResponse: SignBtcTransactionResponseDto = {
    rawTx: 'raw',
    txId: 'txid',
    plan: buildResponse.transaction.plan,
  };
  beforeEach(async () => {
    service = {
      buildTransaction: jest.fn().mockReturnValue(buildResponse),
      sign: jest.fn().mockReturnValue(signResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtcTransactionController],
      providers: [
        {
          provide: BtcTransactionService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<BtcTransactionController>(BtcTransactionController);
  });

  it('delegates build transaction', () => {
    const body: BuildBtcTransactionRequestDto = {
      toAddress: 'bc1qtest',
      changeAddress: 'bc1qtest',
      amount: '1000',
      byteFee: '1',
      utxos: [
        {
          txid: 'a'.repeat(64),
          vout: 0,
          amount: '2000',
          scriptPubKey: '76a914',
          reverseTxId: false,
        },
      ],
    };
    const result = controller.buildTransaction(body);
    expect(service.buildTransaction).toHaveBeenCalledWith(body);
    expect(result).toBe(buildResponse);
  });

  it('delegates sign transaction', () => {
    const body: SignBtcTransactionRequestDto = {
      payload: 'deadbeef',
      privateKeys: ['00'.repeat(32)],
    };
    const result = controller.sign(body);
    expect(service.sign).toHaveBeenCalledWith(body);
    expect(result).toBe(signResponse);
  });
});
