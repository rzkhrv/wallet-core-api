import { BtcAddressAdapter } from '../../adapter/coins/btc/btc-address.adapter';
import { MnemonicAdapter } from '../../adapter/common/mnemonic.adapter';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { BtcAddressService } from './service/btc-address.service';

describe('BTC address flows', () => {
  let walletCore: WalletCoreAdapter;
  let mnemonicAdapter: MnemonicAdapter;
  let addressAdapter: BtcAddressAdapter;
  let addressService: BtcAddressService;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    mnemonicAdapter = new MnemonicAdapter(walletCore);
    addressAdapter = new BtcAddressAdapter(walletCore);
    addressService = new BtcAddressService(addressAdapter);
  });

  it('generates and validates BTC address (adapter)', () => {
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
    expect(result.derivation.path).toContain('m/');

    const validation = addressAdapter.validate({ address: result.address });
    expect(validation.isValid).toBe(true);
  });

  it('generates and validates BTC address (service)', () => {
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
