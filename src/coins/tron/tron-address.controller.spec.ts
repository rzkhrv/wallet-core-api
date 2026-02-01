import { Test, TestingModule } from '@nestjs/testing';
import { TronAddressController } from './tron-address.controller';
import { TronAddressService } from './service/tron-address.service';
import type { GenerateTronAddressRequestDto } from './dto/request/generate-tron-address.request.dto';
import type { ValidateTronAddressRequestDto } from './dto/request/validate-tron-address.request.dto';
import type { GenerateTronAddressResponseDto } from './dto/response/generate-tron-address.response.dto';
import type { ValidateTronAddressResponseDto } from './dto/response/validate-tron-address.response.dto';

describe('TronAddressController', () => {
  let controller: TronAddressController;
  let service: { generate: jest.Mock; validate: jest.Mock };
  const generateResponse: GenerateTronAddressResponseDto = {
    address: 'TXYZ',
    keys: { public: 'pub', private: 'priv' },
    derivation: {
      path: "m/44'/195'/0'/0/0",
      purpose: 44,
      coin: 195,
      account: 0,
      change: false,
      index: 0,
    },
  };
  const validateResponse: ValidateTronAddressResponseDto = { isValid: true };
  beforeEach(async () => {
    service = {
      generate: jest.fn().mockReturnValue(generateResponse),
      validate: jest.fn().mockReturnValue(validateResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TronAddressController],
      providers: [
        {
          provide: TronAddressService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<TronAddressController>(TronAddressController);
  });

  it('delegates address generation', () => {
    const body: GenerateTronAddressRequestDto = {
      mnemonic: { value: 'test mnemonic', passphrase: '' },
      derivation: { account: 0, change: false, index: 0 },
    };
    const result = controller.generate(body);
    expect(service.generate).toHaveBeenCalledWith(body);
    expect(result).toBe(generateResponse);
  });

  it('delegates address validation', () => {
    const body: ValidateTronAddressRequestDto = { address: 'TXYZ' };
    const result = controller.validate(body);
    expect(service.validate).toHaveBeenCalledWith(body);
    expect(result).toBe(validateResponse);
  });
});
