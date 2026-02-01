import { Test, TestingModule } from '@nestjs/testing';
import { TronAddressController } from './tron-address.controller';
import { TronAddressService } from './service/tron-address.service';

describe('TronAddressController', () => {
  let controller: TronAddressController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TronAddressController],
      providers: [
        {
          provide: TronAddressService,
          useValue: { generate: jest.fn(), validate: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<TronAddressController>(TronAddressController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
