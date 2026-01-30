import { TronAddressAdapter } from '../../adapter/coins/tron/tron-address.adapter';
import { MnemonicAdapter } from '../../adapter/common/mnemonic.adapter';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { TronAddressService } from './service/tron-address.service';

describe('TRON address flows', () => {
  let walletCore: WalletCoreAdapter;
  let mnemonicAdapter: MnemonicAdapter;
  let addressAdapter: TronAddressAdapter;
  let addressService: TronAddressService;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    mnemonicAdapter = new MnemonicAdapter(walletCore);
    addressAdapter = new TronAddressAdapter(walletCore);
    addressService = new TronAddressService(addressAdapter);
  });

  it('generates and validates TRON address (adapter)', () => {
    const mnemonic = mnemonicAdapter.generate({
      strength: 128,
      passphrase: '',
    });
    const result = addressAdapter.generate({
      mnemonic: { value: mnemonic.mnemonic, passphrase: '' },
      derivation: { account: 0, change: 0, index: 0 },
    });

    expect(result.address).toBeDefined();
    expect(result.keys.public).toBeDefined();
    expect(result.keys.private).toBeDefined();

    const validation = addressAdapter.validate({ address: result.address });
    expect(validation.isValid).toBe(true);
  });

  it('generates and validates TRON address (service)', () => {
    const mnemonic = mnemonicAdapter.generate({
      strength: 128,
      passphrase: '',
    });
    const result = addressService.generate({
      mnemonic: { value: mnemonic.mnemonic, passphrase: '' },
      derivation: { account: 0, change: false, index: 1 },
    });

    expect(result.address).toBeDefined();

    const validation = addressService.validate({ address: result.address });
    expect(validation.isValid).toBe(true);
  });
});
