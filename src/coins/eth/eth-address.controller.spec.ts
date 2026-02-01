import { Test, TestingModule } from '@nestjs/testing';
import { EthAddressController } from './eth-address.controller';
import { EthAddressService } from './service/eth-address.service';

describe('EthAddressController', () => {
  let controller: EthAddressController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthAddressController],
      providers: [
        {
          provide: EthAddressService,
          useValue: { generate: jest.fn(), validate: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<EthAddressController>(EthAddressController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
