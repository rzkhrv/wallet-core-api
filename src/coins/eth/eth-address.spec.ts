import { EthAddressAdapter } from './adapter/eth-address.adapter';
import { MnemonicAdapter } from '../../common/mnemonic/adapter/mnemonic.adapter';
import { WalletCoreAdapter } from '../../common/wallet-core/wallet-core.adapter';
import { EthAddressService } from './service/eth-address.service';
import { AdapterError } from '../../common/errors/adapter-error';

describe('ETH address flows', () => {
  let walletCore: WalletCoreAdapter;
  let mnemonicAdapter: MnemonicAdapter;
  let addressAdapter: EthAddressAdapter;
  let addressService: EthAddressService;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    mnemonicAdapter = new MnemonicAdapter(walletCore);
    addressAdapter = new EthAddressAdapter(walletCore);
    addressService = new EthAddressService(addressAdapter);
  });

  it('generates and validates ETH address (adapter)', () => {
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
    expect(result.derivation.path).toContain("m/44'/60'");

    const validation = addressAdapter.validate({ address: result.address });
    expect(validation.isValid).toBe(true);
  });

  it('generates and validates ETH address (service)', () => {
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

  it('throws on invalid mnemonic (adapter)', () => {
    expect(() =>
      addressAdapter.generate({
        mnemonic: { value: 'invalid mnemonic', passphrase: '' },
        derivation: { account: 0, change: 0, index: 0 },
      }),
    ).toThrow(AdapterError);
  });
});
