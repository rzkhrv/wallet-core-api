import { Test, TestingModule } from '@nestjs/testing';
import { EthTransactionController } from './eth-transaction.controller';
import { EthTransactionService } from './service/eth-transaction.service';

describe('EthTransactionController', () => {
  let controller: EthTransactionController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthTransactionController],
      providers: [
        {
          provide: EthTransactionService,
          useValue: {
            buildTransaction: jest.fn(),
            buildTransfer: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<EthTransactionController>(EthTransactionController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
