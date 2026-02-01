import { Test, TestingModule } from '@nestjs/testing';
import { BtcAddressController } from './btc-address.controller';
import { BtcAddressService } from './service/btc-address.service';

describe('BtcAddressController', () => {
  let controller: BtcAddressController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtcAddressController],
      providers: [
        {
          provide: BtcAddressService,
          useValue: { generate: jest.fn(), validate: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<BtcAddressController>(BtcAddressController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
