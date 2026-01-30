import { BtcAddressAdapter } from '../../adapter/coins/btc/btc-address.adapter';
import { BtcTransactionAdapter } from '../../adapter/coins/btc/btc-transaction.adapter';
import { MnemonicAdapter } from '../../adapter/common/mnemonic.adapter';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { resolveCoinConfig } from '../coin.config';
import { Coin } from '../enum/coin.enum';

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
    const { coinType } = resolveCoinConfig(core, Coin.BTC);
    const script = core.BitcoinScript.lockScriptForAddress(
      utxoAddress.address,
      coinType,
    );
    const scriptPubKey = core.HexCoding.encode(script.data());
    script.delete();

    const result = transactionAdapter.buildTransaction({
      toAddress: recipientAddress.address,
      changeAddress: utxoAddress.address,
      amount: '1000',
      byteFee: '1',
      utxos: [
        {
          txid: 'a'.repeat(64),
          vout: 0,
          amount: '100000',
          scriptPubKey,
          reverseTxId: false,
        },
      ],
      privateKeys: [utxoAddress.keys.private],
    });

    expect(result.rawTx).toBeDefined();
    expect(result.txId).toBeDefined();
    expect(result.plan.amount).toBe('1000');
  });
});
