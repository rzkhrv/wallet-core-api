import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/errors/api-exception.filter';
import { WalletCoreAdapter } from '../src/common/wallet-core/wallet-core.adapter';
import { resolveBtcWalletCoreConfig } from '../src/coins/btc/btc-wallet-core.config';

type StatusResponse = {
  status: string;
  service?: string;
  timestamp?: string;
};

type MnemonicGenerateResponse = {
  mnemonic: string;
  strengthBits: number;
  isPassphraseUsed?: boolean;
};

type ValidateResponse = { isValid: boolean };

type AddressGenerateResponse = {
  address: string;
  keys: { public: string; private: string };
};

type TronBuildResponse = {
  payload: string;
  transaction: {
    type: string;
    ownerAddress?: string;
    toAddress?: string;
    amount?: string;
    assetName?: string;
    contractAddress?: string;
    callValue?: string;
    timestamp: string;
    expiration: string;
    feeLimit?: string | null;
    memo?: string | null;
  };
};
type TronSignResponse = { txId: string; signature: string };

type BtcBuildResponse = {
  payload: string;
  transaction: {
    outputs?: { address?: string; amount?: string; isChange?: boolean }[];
    plan?: { amount?: string; change?: string };
  };
};
type BtcSignResponse = {
  rawTx: string;
  txId: string;
  plan?: { amount?: string };
};

type EthBuildResponse = {
  payload: string;
  transaction: Record<string, string>;
};
type EthSignResponse = { rawTx: string; signature?: { v?: string } };

describe('Wallet Core API (e2e)', () => {
  let app: INestApplication<App>;
  let walletCore: WalletCoreAdapter;
  let mnemonic: string;
  let btcAddress: string;
  let btcPrivateKey: string;
  let ethAddress: string;
  let ethPrivateKey: string;
  let tronAddress: string;
  let tronPrivateKey: string;
  let tronPayload: string;
  let tronTrc20Payload: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ApiExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    const body = response.body as StatusResponse;
    expect(body.status).toBe('ok');
    expect(body.service).toBe('wallet-core-api');
    expect(body.timestamp).toBeDefined();
  });

  it('POST /api/v1/mnemonic/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/mnemonic/generate')
      .send({ strength: 128 })
      .expect(201);

    const body = response.body as MnemonicGenerateResponse;
    expect(body.mnemonic).toBeDefined();
    expect(body.strengthBits).toBe(128);
    mnemonic = body.mnemonic;
  });

  it('POST /api/v1/mnemonic/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/mnemonic/validate')
      .send({ mnemonic })
      .expect(201);

    const body = response.body as ValidateResponse;
    expect(body.isValid).toBe(true);
  });

  it('POST /api/v1/address/btc/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/btc/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: false, index: 0 },
      })
      .expect(201);

    const body = response.body as AddressGenerateResponse;
    expect(body.address).toBeDefined();
    expect(body.keys?.public).toBeDefined();
    expect(body.keys?.private).toBeDefined();
    btcAddress = body.address;
    btcPrivateKey = body.keys.private;
  });

  it('POST /api/v1/address/btc/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/btc/validate')
      .send({ address: btcAddress })
      .expect(201);

    const body = response.body as ValidateResponse;
    expect(body.isValid).toBe(true);
  });

  it('POST /api/v1/address/eth/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/eth/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: false, index: 0 },
      })
      .expect(201);

    const body = response.body as AddressGenerateResponse;
    expect(body.address).toBeDefined();
    expect(body.keys?.public).toBeDefined();
    expect(body.keys?.private).toBeDefined();
    ethAddress = body.address;
    ethPrivateKey = body.keys.private;
  });

  it('POST /api/v1/address/eth/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/eth/validate')
      .send({ address: ethAddress })
      .expect(201);

    const body = response.body as ValidateResponse;
    expect(body.isValid).toBe(true);
  });

  it('POST /api/v1/address/tron/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/tron/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: false, index: 0 },
      })
      .expect(201);

    const body = response.body as AddressGenerateResponse;
    expect(body.address).toBeDefined();
    expect(body.keys?.public).toBeDefined();
    expect(body.keys?.private).toBeDefined();
    tronAddress = body.address;
    tronPrivateKey = body.keys.private;
  });

  it('POST /api/v1/address/tron/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/tron/validate')
      .send({ address: tronAddress })
      .expect(201);

    const body = response.body as ValidateResponse;
    expect(body.isValid).toBe(true);
  });

  it('POST /api/v1/transaction/tron/build-transaction', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transaction')
      .send({
        ownerAddress: tronAddress,
        toAddress: tronAddress,
        amount: '1',
      })
      .expect(201);

    const body = response.body as TronBuildResponse;
    expect(body.payload).toBeDefined();
    expect(body.payload).toMatch(/^(0x)?[0-9a-fA-F]+$/);
    expect(body.transaction.type).toBe('trx');
    expect(body.transaction.ownerAddress).toBe(tronAddress);
    expect(body.transaction.toAddress).toBe(tronAddress);
    tronPayload = body.payload;
  });

  it('POST /api/v1/transaction/tron/build-transaction rejects invalid address', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transaction')
      .send({
        ownerAddress: 'invalid',
        toAddress: tronAddress,
        amount: '1',
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/build-transfer (trc20)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transfer')
      .send({
        transferType: 'trc20',
        ownerAddress: tronAddress,
        toAddress: tronAddress,
        contractAddress: tronAddress,
        amount: '1',
        feeLimit: '10000000',
        callValue: '0',
      })
      .expect(201);

    const body = response.body as TronBuildResponse;
    expect(body.payload).toBeDefined();
    expect(body.payload).toMatch(/^(0x)?[0-9a-fA-F]+$/);
    expect(body.transaction.type).toBe('trc20');
    expect(body.transaction.toAddress).toBe(tronAddress);
    expect(body.transaction.amount).toBe('1');
    expect(body.transaction.contractAddress).toBe(tronAddress);
    expect(body.transaction.callValue).toBe('0');
    tronTrc20Payload = body.payload;
  });

  it('POST /api/v1/transaction/tron/build-transfer rejects invalid contract', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transfer')
      .send({
        transferType: 'trc20',
        ownerAddress: tronAddress,
        toAddress: tronAddress,
        contractAddress: 'invalid',
        amount: '1',
        feeLimit: '10000000',
        callValue: '0',
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/sign (trx)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign')
      .send({
        payload: tronPayload,
        privateKey: tronPrivateKey,
      })
      .expect(201);

    const body = response.body as TronSignResponse;
    expect(body.txId).toBeDefined();
    expect(body.signature).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/sign (trc20)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign')
      .send({
        payload: tronTrc20Payload,
        privateKey: tronPrivateKey,
      })
      .expect(201);

    const body = response.body as TronSignResponse;
    expect(body.txId).toBeDefined();
    expect(body.signature).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/sign rejects invalid json', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign')
      .send({
        payload: '0x7b696e76616c6964',
        privateKey: '00'.repeat(32),
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/btc/build-transaction', async () => {
    const core = walletCore.getCore();
    const { coinType } = resolveBtcWalletCoreConfig(core);
    const script = core.BitcoinScript.lockScriptForAddress(
      btcAddress,
      coinType,
    );
    const encodedScript = core.HexCoding.encode(script.data());
    const scriptPubKey = encodedScript.startsWith('0x')
      ? encodedScript.slice(2)
      : encodedScript;
    script.delete();

    const buildResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/btc/build-transaction')
      .send({
        outputs: [
          { address: btcAddress, amount: '1000' },
          { address: btcAddress, isChange: true },
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
      })
      .expect(201);

    const btcBuildBody = buildResponse.body as BtcBuildResponse;
    expect(btcBuildBody.payload).toBeDefined();
    expect(btcBuildBody.transaction.plan?.amount).toBe('1000');
    expect(btcBuildBody.transaction.outputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ address: btcAddress, isChange: false }),
        expect.objectContaining({ address: btcAddress, isChange: true }),
      ]),
    );

    const signResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/btc/sign')
      .send({
        payload: btcBuildBody.payload,
        privateKeys: [btcPrivateKey],
      })
      .expect(201);

    const btcSignBody = signResponse.body as BtcSignResponse;
    expect(btcSignBody.rawTx).toBeDefined();
    expect(btcSignBody.txId).toBeDefined();
    expect(btcSignBody.plan?.amount).toBe('1000');
  });

  it('POST /api/v1/transaction/eth/build-transaction', async () => {
    const buildResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/build-transaction')
      .send({
        chainId: '1',
        nonce: '0',
        gasPrice: '20000000000',
        gasLimit: '21000',
        toAddress: ethAddress,
        amount: '1000000000000000',
      })
      .expect(201);

    const ethBuildBody = buildResponse.body as EthBuildResponse;
    expect(ethBuildBody.payload).toBeDefined();
    expect(ethBuildBody.transaction.chainId).toBe('1');
    expect(ethBuildBody.transaction.toAddress).toBe(ethAddress);

    const signResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/sign')
      .send({
        payload: ethBuildBody.payload,
        privateKey: ethPrivateKey,
      })
      .expect(201);

    const ethSignBody = signResponse.body as EthSignResponse;
    expect(ethSignBody.rawTx).toBeDefined();
    expect(ethSignBody.signature?.v).toBeDefined();
  });

  it('POST /api/v1/transaction/eth/build-transfer', async () => {
    const buildResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/build-transfer')
      .send({
        chainId: '1',
        nonce: '0',
        gasPrice: '20000000000',
        gasLimit: '60000',
        toAddress: ethAddress,
        tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        amount: '1000000',
      })
      .expect(201);

    const ethTransferBuildBody = buildResponse.body as EthBuildResponse;
    expect(ethTransferBuildBody.payload).toBeDefined();
    expect(ethTransferBuildBody.transaction.chainId).toBe('1');
    expect(ethTransferBuildBody.transaction.toAddress).toBe(ethAddress);

    const signResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/sign')
      .send({
        payload: ethTransferBuildBody.payload,
        privateKey: ethPrivateKey,
      })
      .expect(201);

    const ethTransferSignBody = signResponse.body as EthSignResponse;
    expect(ethTransferSignBody.rawTx).toBeDefined();
    expect(ethTransferSignBody.signature?.v).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/build-transfer rejects unexpected rawJson', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transfer')
      .send({
        rawJson: JSON.stringify({
          raw_data: { contract: [{ type: 'TriggerSmartContract' }] },
        }),
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/build-transaction rejects unexpected rawJson', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transaction')
      .send({
        rawJson: '{invalid',
      })
      .expect(400);
  });
});
