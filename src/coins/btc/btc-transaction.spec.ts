import { BtcAddressAdapter } from './adapter/btc-address.adapter';
import { BtcTransactionAdapter } from './adapter/btc-transaction.adapter';
import { MnemonicAdapter } from '../../common/mnemonic/adapter/mnemonic.adapter';
import { WalletCoreAdapter } from '../../common/wallet-core/wallet-core.adapter';
import { resolveBtcWalletCoreConfig } from './btc-wallet-core.config';
import { AdapterError } from '../../common/errors/adapter-error';

describe('BTC transaction signing', () => {
  let walletCore: WalletCoreAdapter;
  let mnemonicAdapter: MnemonicAdapter;
  let addressAdapter: BtcAddressAdapter;
  let transactionAdapter: BtcTransactionAdapter;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    mnemonicAdapter = new MnemonicAdapter(walletCore);
    addressAdapter = new BtcAddressAdapter(walletCore);
    transactionAdapter = new BtcTransactionAdapter(walletCore);
  });

  it('builds and signs BTC transaction', () => {
    const mnemonic = mnemonicAdapter.generate({
      strength: 128,
      passphrase: '',
    });
    const utxoAddress = addressAdapter.generate({
      mnemonic: { value: mnemonic.mnemonic, passphrase: '' },
      derivation: { account: 0, change: 0, index: 0 },
    });
    const recipientAddress = addressAdapter.generate({
      mnemonic: { value: mnemonic.mnemonic, passphrase: '' },
      derivation: { account: 0, change: 0, index: 1 },
    });

    const core = walletCore.getCore();
    const { coinType } = resolveBtcWalletCoreConfig(core);
    const script = core.BitcoinScript.lockScriptForAddress(
      utxoAddress.address,
      coinType,
    );
    const scriptPubKey = core.HexCoding.encode(script.data());
    script.delete();

    const buildResult = transactionAdapter.buildTransaction({
      outputs: [
        { address: recipientAddress.address, amount: '1000' },
        { address: utxoAddress.address, isChange: true },
      ],
      byteFee: '1',
      utxos: [
        {
          txid: 'a'.repeat(64),
          vout: 0,
          amount: '100000',
          scriptPubKey,
        },
      ],
    });

    expect(buildResult.payload).toBeDefined();
    expect(buildResult.transaction.plan.amount).toBe('1000');
    expect(buildResult.transaction.outputs).toEqual(
      expect.arrayContaining([
        {
          address: recipientAddress.address,
          amount: '1000',
          isChange: false,
        },
        {
          address: utxoAddress.address,
          amount: buildResult.transaction.plan.change,
          isChange: true,
        },
      ]),
    );

    const signResult = transactionAdapter.signTransaction({
      payload: buildResult.payload,
      privateKeys: [utxoAddress.keys.private],
    });

    expect(signResult.rawTx).toBeDefined();
    expect(signResult.txId).toBeDefined();
    expect(signResult.plan.amount).toBe('1000');
  });

  it('throws when transaction plan fails', () => {
    const mnemonic = mnemonicAdapter.generate({
      strength: 128,
      passphrase: '',
    });
    const utxoAddress = addressAdapter.generate({
      mnemonic: { value: mnemonic.mnemonic, passphrase: '' },
      derivation: { account: 0, change: 0, index: 0 },
    });
    const recipientAddress = addressAdapter.generate({
      mnemonic: { value: mnemonic.mnemonic, passphrase: '' },
      derivation: { account: 0, change: 0, index: 1 },
    });
    const core = walletCore.getCore();
    const { coinType } = resolveBtcWalletCoreConfig(core);
    const script = core.BitcoinScript.lockScriptForAddress(
      utxoAddress.address,
      coinType,
    );
    const scriptPubKey = core.HexCoding.encode(script.data());
    script.delete();
    expect(() =>
      transactionAdapter.buildTransaction({
        outputs: [
          { address: recipientAddress.address, amount: '1000' },
          { address: utxoAddress.address, isChange: true },
        ],
        byteFee: '1',
        utxos: [
          {
            txid: 'b'.repeat(64),
            vout: 0,
            amount: '1',
            scriptPubKey,
          },
        ],
      }),
    ).toThrow(AdapterError);
  });
});
