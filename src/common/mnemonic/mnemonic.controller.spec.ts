import { Test, TestingModule } from '@nestjs/testing';
import { MnemonicController } from './mnemonic.controller';
import { MnemonicService } from './mnemonic.service';

describe('MnemonicController', () => {
  let controller: MnemonicController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MnemonicController],
      providers: [
        {
          provide: MnemonicService,
          useValue: { generate: jest.fn(), validate: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<MnemonicController>(MnemonicController);
  });
  it('returns admin test status', () => {
    const result: { status: string } = controller.adminTest();
    expect(result.status).toBe('ok');
  });
});
