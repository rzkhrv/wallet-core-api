import { Test, TestingModule } from '@nestjs/testing';
import { TronTransactionController } from './tron-transaction.controller';
import { TronTransactionService } from './service/tron-transaction.service';

describe('TronTransactionController', () => {
  let controller: TronTransactionController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TronTransactionController],
      providers: [
        {
          provide: TronTransactionService,
          useValue: {
            buildTransaction: jest.fn(),
            buildTransfer: jest.fn(),
            signRawTransaction: jest.fn(),
            signRawTransfer: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<TronTransactionController>(TronTransactionController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
