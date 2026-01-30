import { TronTransactionAdapter } from '../../adapter/coins/tron/tron-transaction.adapter';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { AdapterError } from '../../adapter/common/adapter-error';
import { TW } from '@trustwallet/wallet-core';

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

    const transfer = TW.Tron.Proto.TransferContract.create({
      ownerAddress,
      toAddress: recipientAddress,
      amount: 1,
    });
    const transaction = TW.Tron.Proto.Transaction.create({
      transfer,
      timestamp: Date.now(),
      expiration: Date.now() + 60_000,
    });

    const result = transactionAdapter.buildTransaction({
      transaction,
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
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(AdapterError);
  });
});
