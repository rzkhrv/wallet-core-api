import { TronTransactionAdapter } from '../../adapter/coins/tron/tron-transaction.adapter';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { AdapterError } from '../../adapter/common/adapter-error';

describe('TRON transaction build/signing', () => {
  let walletCore: WalletCoreAdapter;
  let transactionAdapter: TronTransactionAdapter;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    transactionAdapter = new TronTransactionAdapter(walletCore);
  });

  it('builds TRON transfer without signing (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const privateKey = core.HexCoding.encode(
      wallet.getKeyForCoin(core.CoinType.tron).data(),
    );

    const now = Date.now();
    const result = transactionAdapter.buildTransfer({
      transferType: 'trx',
      ownerAddress,
      toAddress: recipientAddress,
      amount: '1',
      timestamp: `${now}`,
      expiration: `${now + 60_000}`,
    });

    expect(result.rawJson).toBeDefined();
    const parsed = JSON.parse(result.rawJson);
    expect(parsed.transfer).toBeDefined();

    const signed = transactionAdapter.signTransaction({
      rawJson: result.rawJson,
      privateKey,
    });

    expect(signed.txId).toBeDefined();
    expect(signed.signature).toBeDefined();
    expect(signed.signedJson).toBeDefined();

    wallet.delete();
  });

  it('throws when rawJson is invalid', () => {
    expect(() =>
      transactionAdapter.signTransaction({
        rawJson: '{invalid',
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(AdapterError);
  });
});
