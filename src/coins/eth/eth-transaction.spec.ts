import { EthTransactionAdapter } from '../../adapter/coins/eth/eth-transaction.adapter';
import { AdapterError } from '../../adapter/common/adapter-error';
import { WalletCoreAdapter } from '../../adapter/common/wallet-core.adapter';
import { EthTransactionService } from './service/eth-transaction.service';

describe('ETH transaction signing', () => {
  let walletCore: WalletCoreAdapter;
  let transactionAdapter: EthTransactionAdapter;
  let transactionService: EthTransactionService;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    transactionAdapter = new EthTransactionAdapter(walletCore);
    transactionService = new EthTransactionService(transactionAdapter);
  });

  it('builds ERC20 transfer (adapter)', () => {
    const result = transactionAdapter.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
    expect(result.signature.v).toBeDefined();
    expect(result.signature.r).toBeDefined();
    expect(result.signature.s).toBeDefined();
  });

  it('builds ETH transaction (adapter)', () => {
    const result = transactionAdapter.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
    expect(result.signature.v).toBeDefined();
    expect(result.signature.r).toBeDefined();
    expect(result.signature.s).toBeDefined();
  });

  it('builds ERC20 transfer (service)', () => {
    const result = transactionService.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
  });

  it('builds ETH transaction (service)', () => {
    const result = transactionService.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
  });

  it('throws on invalid private key', () => {
    expect(() =>
      transactionAdapter.buildTransfer({
        chainId: '1',
        nonce: '0',
        gasPrice: '20000000000',
        gasLimit: '60000',
        toAddress: '0x1111111111111111111111111111111111111111',
        tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        amount: '1000000',
        privateKey: 'invalid',
      }),
    ).toThrow(AdapterError);
  });

  it('throws on invalid private key for ETH transaction', () => {
    expect(() =>
      transactionAdapter.buildTransaction({
        chainId: '1',
        nonce: '0',
        gasPrice: '20000000000',
        gasLimit: '21000',
        toAddress: '0x1111111111111111111111111111111111111111',
        amount: '1000000000000000',
        privateKey: 'invalid',
      }),
    ).toThrow(AdapterError);
  });
});
