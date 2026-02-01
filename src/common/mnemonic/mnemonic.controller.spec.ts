import { Test, TestingModule } from '@nestjs/testing';
import { MnemonicController } from './mnemonic.controller';
import { MnemonicService } from './mnemonic.service';
import type { GenerateMnemonicRequestDto } from './dto/request/generate-mnemonic.request.dto';
import type { ValidateMnemonicRequestDto } from './dto/request/validate-mnemonic.request.dto';
import type { GenerateMnemonicResponseDto } from './dto/response/generate-mnemonic.response.dto';
import type { ValidateMnemonicResponseDto } from './dto/response/validate-mnemonic.response.dto';

describe('MnemonicController', () => {
  let controller: MnemonicController;
  let service: { generate: jest.Mock; validate: jest.Mock };
  const generateResponse: GenerateMnemonicResponseDto = {
    mnemonic: 'test mnemonic',
    strengthBits: 128,
    isPassphraseUsed: false,
  };
  const validateResponse: ValidateMnemonicResponseDto = { isValid: true };
  beforeEach(async () => {
    service = {
      generate: jest.fn().mockReturnValue(generateResponse),
      validate: jest.fn().mockReturnValue(validateResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MnemonicController],
      providers: [
        {
          provide: MnemonicService,
          useValue: service,
        },
      ],
    }).compile();
    controller = module.get<MnemonicController>(MnemonicController);
  });

  it('delegates mnemonic generation', () => {
    const body: GenerateMnemonicRequestDto = {
      strength: 128,
      passphrase: '',
    };
    const result = controller.generate(body);
    expect(service.generate).toHaveBeenCalledWith(body);
    expect(result).toBe(generateResponse);
  });

  it('delegates mnemonic validation', () => {
    const body: ValidateMnemonicRequestDto = {
      mnemonic: 'test mnemonic',
      passphrase: '',
    };
    const result = controller.validate(body);
    expect(service.validate).toHaveBeenCalledWith(body);
    expect(result).toBe(validateResponse);
  });
});
