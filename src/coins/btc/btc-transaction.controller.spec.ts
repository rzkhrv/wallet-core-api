import { Test, TestingModule } from '@nestjs/testing';
import { BtcTransactionController } from './btc-transaction.controller';
import { BtcTransactionService } from './service/btc-transaction.service';

describe('BtcTransactionController', () => {
  let controller: BtcTransactionController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtcTransactionController],
      providers: [
        {
          provide: BtcTransactionService,
          useValue: { buildTransaction: jest.fn(), signTransaction: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<BtcTransactionController>(BtcTransactionController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
