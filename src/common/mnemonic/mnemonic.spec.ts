import { MnemonicAdapter } from './adapter/mnemonic.adapter';
import { WalletCoreAdapter } from '../wallet-core/wallet-core.adapter';
import { MnemonicService } from './mnemonic.service';

describe('Mnemonic flows', () => {
  let walletCore: WalletCoreAdapter;
  let adapter: MnemonicAdapter;
  let service: MnemonicService;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    adapter = new MnemonicAdapter(walletCore);
    service = new MnemonicService(adapter);
  });

  it('generates mnemonic (adapter)', () => {
    const result = adapter.generate({ strength: 128, passphrase: '' });

    expect(result.mnemonic).toBeDefined();
    expect(result.strengthBits).toBe(128);
    expect(result.isPassphraseUsed).toBe(false);
  });

  it('validates mnemonic (service)', () => {
    const generated = adapter.generate({ strength: 128, passphrase: '' });
    const result = service.validate({ mnemonic: generated.mnemonic });

    expect(result.isValid).toBe(true);
  });
});
