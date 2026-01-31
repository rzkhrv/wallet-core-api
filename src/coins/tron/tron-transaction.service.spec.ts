import { BadRequestException } from '@nestjs/common';
import { TronTransactionService } from './service/tron-transaction.service';
import { TronTransactionAdapter } from '../../adapter/coins/tron/tron-transaction.adapter';

describe('TRON transaction service', () => {
  const transferJson = JSON.stringify({
    raw_data: { contract: [{ type: 'TransferContract' }] },
  });
  const smartContractJson = JSON.stringify({
    raw_data: { contract: [{ type: 'TriggerSmartContract' }] },
  });
  const unknownContractJson = JSON.stringify({
    raw_data: { contract: [{ type: 'VoteWitnessContract' }] },
  });

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
    const adapter = {
      buildTransaction: jest.fn().mockReturnValue(buildResponse),
      signTransaction: jest.fn().mockReturnValue(signResponse),
    } as unknown as TronTransactionAdapter;
    return {
      adapter,
      service: new TronTransactionService(adapter),
    };
  };

  it('builds transfer from params using transfer contract', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransfer({
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
    });

    expect(result).toBe(buildResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trx',
      }),
    );
  });

  it('builds TRC10 transaction when transferType is trc10', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransaction({
      transferType: 'trc10',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '100',
      assetName: 'TOKEN',
    });

    expect(result).toBe(buildResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trc10',
        assetName: 'TOKEN',
      }),
    );
  });

  it('signs raw transfer when rawJson is a transfer contract', () => {
    const { adapter, service } = makeService();
    const result = service.signRawTransfer({
      rawJson: transferJson,
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(signResponse);
    expect(adapter.signTransaction).toHaveBeenCalledTimes(1);
  });

  it('signs raw transaction when rawJson is provided', () => {
    const { adapter, service } = makeService();
    const result = service.signRawTransaction({
      rawJson: transferJson,
      privateKey: '00'.repeat(32),
      txId: 'txid',
    });

    expect(result).toBe(signResponse);
    expect(adapter.signTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        rawJson: transferJson,
        privateKey: '00'.repeat(32),
        txId: 'txid',
      }),
    );
  });

  it('rejects raw transfer signing for smart contract rawJson', () => {
    const { service } = makeService();
    expect(() =>
      service.signRawTransfer({
        rawJson: smartContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects raw transfer signing for unknown contract type', () => {
    const { service } = makeService();
    expect(() =>
      service.signRawTransfer({
        rawJson: unknownContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });
});
