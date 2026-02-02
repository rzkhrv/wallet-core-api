import { TronTransactionService } from './service/tron-transaction.service';
import { TronTransactionAdapter } from './adapter/tron-transaction.adapter';

describe('TRON transaction service', () => {
  const adapterBuildResponse = {
    payload: '0xdeadbeef',
    transaction: {
      type: 'trx',
      ownerAddress: 'TJSON',
      toAddress: 'TDEST',
      amount: '2',
      timestamp: '1000',
      expiration: '2000',
      feeLimit: null,
      memo: null,
    },
  };
  const signResponse = {
    txId: 'aa',
    signature: 'bb',
    refBlockBytes: 'cc',
    refBlockHash: 'dd',
    rawDataHex: 'ee',
    signedJson: '{}',
    visible: false,
  };

  const makeService = () => {
    const adapter: {
      buildTransaction: jest.Mock;
      buildTransfer: jest.Mock;
      signTransaction: jest.Mock;
    } = {
      buildTransaction: jest.fn().mockReturnValue(adapterBuildResponse),
      buildTransfer: jest.fn().mockReturnValue(adapterBuildResponse),
      signTransaction: jest.fn().mockReturnValue(signResponse),
    };
    return {
      adapter,
      service: new TronTransactionService(
        adapter as unknown as TronTransactionAdapter,
      ),
    };
  };

  it('builds TRX transaction from params', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransaction({
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
      blockId: '11'.repeat(32),
      blockNumber: '1',
    });
    expect(result).toEqual(adapterBuildResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerAddress: 'TXYZ',
        toAddress: 'TABC',
        amount: '1',
        blockId: '11'.repeat(32),
        blockNumber: '1',
      }),
    );
    const buildCalls = adapter.buildTransaction.mock.calls as Array<
      [{ timestamp?: string; expiration?: string }]
    >;
    const buildArgs = buildCalls[0]?.[0];
    expect(buildArgs.timestamp).toEqual(expect.any(String));
    expect(buildArgs.expiration).toEqual(expect.any(String));
  });

  it('builds TRC20 transfer from params', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransfer({
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      contractAddress: 'TCONTRACT',
      amount: '100',
      blockId: '11'.repeat(32),
      blockNumber: '1',
      callValue: '0',
      feeLimit: '10000000',
    });
    expect(result).toEqual(adapterBuildResponse);
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: 'TCONTRACT',
        callValue: '0',
        feeLimit: '10000000',
        blockId: '11'.repeat(32),
        blockNumber: '1',
      }),
    );
    const transferCalls = adapter.buildTransfer.mock.calls as Array<
      [{ timestamp?: string; expiration?: string }]
    >;
    const transferArgs = transferCalls[0]?.[0];
    expect(transferArgs.timestamp).toEqual(expect.any(String));
    expect(transferArgs.expiration).toEqual(expect.any(String));
  });

  it('defaults timestamp and expiration when missing', () => {
    const { adapter, service } = makeService();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
    service.buildTransaction({
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
      blockId: '11'.repeat(32),
      blockNumber: '1',
    });
    expect(adapter.buildTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: '1000000',
        expiration: '1060000',
      }),
    );
    nowSpy.mockRestore();
  });

  it('signs transaction when payload is provided', () => {
    const { adapter, service } = makeService();
    const payload = '0x0a0200002208';
    const result = service.sign({
      payload,
      privateKey: '00'.repeat(32),
      txId: 'txid',
    });
    expect(result).toBe(signResponse);
    expect(adapter.signTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        payload,
        privateKey: '00'.repeat(32),
        txId: 'txid',
      }),
    );
  });
});
