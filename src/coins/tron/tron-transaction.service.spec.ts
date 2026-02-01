import { TronTransactionService } from './service/tron-transaction.service';
import { TronTransactionAdapter } from './adapter/tron-transaction.adapter';

describe('TRON transaction service', () => {
  const buildResponse = {
    rawJson: '{"transfer":{}}',
  };
  const signResponse = {
    txId: 'aa',
    signature: 'bb',
    refBlockBytes: 'cc',
    refBlockHash: 'dd',
    signedJson: '{}',
  };

  const makeService = () => {
    const adapter: {
      buildTransaction: jest.Mock;
      buildTransfer: jest.Mock;
      signTransaction: jest.Mock;
    } = {
      buildTransaction: jest.fn().mockReturnValue(buildResponse),
      buildTransfer: jest.fn().mockReturnValue(buildResponse),
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
    });
    expect(result).toBe(buildResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerAddress: 'TXYZ',
        toAddress: 'TABC',
        amount: '1',
      }),
    );
  });

  it('builds TRC10 transfer from params', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransfer({
      transferType: 'trc10',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '100',
      assetName: 'TOKEN',
    });
    expect(result).toBe(buildResponse);
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trc10',
        assetName: 'TOKEN',
      }),
    );
  });

  it('builds TRC20 transfer from params', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransfer({
      transferType: 'trc20',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      contractAddress: 'TCONTRACT',
      amount: '100',
      callValue: '0',
      feeLimit: '10000000',
    });
    expect(result).toBe(buildResponse);
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trc20',
        contractAddress: 'TCONTRACT',
        callValue: '0',
        feeLimit: '10000000',
      }),
    );
  });

  it('signs raw transaction when rawJson is provided', () => {
    const { adapter, service } = makeService();
    const result = service.sign({
      rawJson: '{"raw_data":{}}',
      privateKey: '00'.repeat(32),
      txId: 'txid',
    });
    expect(result).toBe(signResponse);
    expect(adapter.signTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        rawJson: '{"raw_data":{}}',
        privateKey: '00'.repeat(32),
        txId: 'txid',
      }),
    );
  });
});
