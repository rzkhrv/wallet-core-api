import { Test, TestingModule } from '@nestjs/testing';
import { BtcAddressController } from './btc-address.controller';
import { BtcAddressService } from './service/btc-address.service';
import type { GenerateBtcAddressRequestDto } from './dto/request/generate-btc-address.request.dto';
import type { ValidateBtcAddressRequestDto } from './dto/request/validate-btc-address.request.dto';
import type { GenerateBtcAddressResponseDto } from './dto/response/generate-btc-address.response.dto';
import type { ValidateBtcAddressResponseDto } from './dto/response/validate-btc-address.response.dto';

describe('BtcAddressController', () => {
  let controller: BtcAddressController;
  let service: { generate: jest.Mock; validate: jest.Mock };
  const generateResponse: GenerateBtcAddressResponseDto = {
    address: 'bc1qtest',
    keys: { public: 'pub', private: 'priv' },
    derivation: {
      path: "m/84'/0'/0'/0/0",
      purpose: 84,
      coin: 0,
      account: 0,
      change: false,
      index: 0,
    },
  };
  const validateResponse: ValidateBtcAddressResponseDto = { isValid: true };
  beforeEach(async () => {
    service = {
      generate: jest.fn().mockReturnValue(generateResponse),
      validate: jest.fn().mockReturnValue(validateResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtcAddressController],
      providers: [
        {
          provide: BtcAddressService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<BtcAddressController>(BtcAddressController);
  });

  it('delegates address generation', () => {
    const body: GenerateBtcAddressRequestDto = {
      mnemonic: { value: 'test mnemonic', passphrase: '' },
      derivation: { account: 0, change: false, index: 0 },
    };
    const result = controller.generate(body);
    expect(service.generate).toHaveBeenCalledWith(body);
    expect(result).toBe(generateResponse);
  });

  it('delegates address validation', () => {
    const body: ValidateBtcAddressRequestDto = { address: 'bc1qtest' };
    const result = controller.validate(body);
    expect(service.validate).toHaveBeenCalledWith(body);
    expect(result).toBe(validateResponse);
  });
});
