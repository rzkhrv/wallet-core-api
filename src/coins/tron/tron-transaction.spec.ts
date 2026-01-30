import { TronTransactionAdapter } from '../../adapter/coins/tron/tron-transaction.adapter';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { AdapterError } from '../../adapter/common/adapter-error';

describe('TRON transaction signing', () => {
  let walletCore: WalletCoreAdapter;
  let transactionAdapter: TronTransactionAdapter;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    transactionAdapter = new TronTransactionAdapter(walletCore);
  });

  it('builds and signs TRON transfer (adapter)', () => {
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
      privateKey,
    });

    expect(result.txId).toBeDefined();
    expect(result.signature).toBeDefined();
    expect(result.signedJson).toBeDefined();

    wallet.delete();
  });

  it('throws when transaction input is missing', () => {
    expect(() =>
      transactionAdapter.buildTransaction({
        rawJson: '',
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(AdapterError);
  });
});
