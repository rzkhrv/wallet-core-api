import { Test, TestingModule } from '@nestjs/testing';
import { EthAddressController } from './eth-address.controller';
import { EthAddressService } from './service/eth-address.service';
import type { GenerateEthAddressRequestDto } from './dto/request/generate-eth-address.request.dto';
import type { ValidateEthAddressRequestDto } from './dto/request/validate-eth-address.request.dto';
import type { GenerateEthAddressResponseDto } from './dto/response/generate-eth-address.response.dto';
import type { ValidateEthAddressResponseDto } from './dto/response/validate-eth-address.response.dto';

describe('EthAddressController', () => {
  let controller: EthAddressController;
  let service: { generate: jest.Mock; validate: jest.Mock };
  const generateResponse: GenerateEthAddressResponseDto = {
    address: '0xabc',
    keys: { public: 'pub', private: 'priv' },
    derivation: {
      path: "m/44'/60'/0'/0/0",
      purpose: 44,
      coin: 60,
      account: 0,
      change: false,
      index: 0,
    },
  };
  const validateResponse: ValidateEthAddressResponseDto = { isValid: true };
  beforeEach(async () => {
    service = {
      generate: jest.fn().mockReturnValue(generateResponse),
      validate: jest.fn().mockReturnValue(validateResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthAddressController],
      providers: [
        {
          provide: EthAddressService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<EthAddressController>(EthAddressController);
  });

  it('delegates address generation', () => {
    const body: GenerateEthAddressRequestDto = {
      mnemonic: { value: 'test mnemonic', passphrase: '' },
      derivation: { account: 0, change: false, index: 0 },
    };
    const result = controller.generate(body);
    expect(service.generate).toHaveBeenCalledWith(body);
    expect(result).toBe(generateResponse);
  });

  it('delegates address validation', () => {
    const body: ValidateEthAddressRequestDto = { address: '0xabc' };
    const result = controller.validate(body);
    expect(service.validate).toHaveBeenCalledWith(body);
    expect(result).toBe(validateResponse);
  });
});
