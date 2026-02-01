import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/errors/api-exception.filter';
import { WalletCoreAdapter } from '../src/adapter/common/wallet-core.adapter';
import { resolveCoinConfig } from '../src/coins/coin.config';
import { Coin } from '../src/coins/enum/coin.enum';

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
  let tronRawJson: string;
  let tronTrc20RawJson: string;

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

    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('wallet-core-api');
    expect(response.body.timestamp).toBeDefined();
  });

  it.each([
    ['GET /admin/test', '/admin/test'],
    ['GET /api/v1/mnemonic/admin/test', '/api/v1/mnemonic/admin/test'],
    ['GET /api/v1/address/btc/admin/test', '/api/v1/address/btc/admin/test'],
    ['GET /api/v1/address/eth/admin/test', '/api/v1/address/eth/admin/test'],
    ['GET /api/v1/address/tron/admin/test', '/api/v1/address/tron/admin/test'],
    [
      'GET /api/v1/transaction/btc/admin/test',
      '/api/v1/transaction/btc/admin/test',
    ],
    [
      'GET /api/v1/transaction/eth/admin/test',
      '/api/v1/transaction/eth/admin/test',
    ],
    [
      'GET /api/v1/transaction/tron/admin/test',
      '/api/v1/transaction/tron/admin/test',
    ],
  ])('%s', async (_label: string, path: string) => {
    const response = await request(app.getHttpServer()).get(path).expect(200);
    expect(response.body.status).toBe('ok');
  });

  it('POST /api/v1/mnemonic/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/mnemonic/generate')
      .send({ strength: 128 })
      .expect(201);

    expect(response.body.mnemonic).toBeDefined();
    expect(response.body.strengthBits).toBe(128);
    mnemonic = response.body.mnemonic;
  });

  it('POST /api/v1/mnemonic/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/mnemonic/validate')
      .send({ mnemonic })
      .expect(201);

    expect(response.body.isValid).toBe(true);
  });

  it('POST /api/v1/address/btc/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/btc/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: false, index: 0 },
      })
      .expect(201);

    expect(response.body.address).toBeDefined();
    expect(response.body.keys?.public).toBeDefined();
    expect(response.body.keys?.private).toBeDefined();
    btcAddress = response.body.address;
    btcPrivateKey = response.body.keys.private;
  });

  it('POST /api/v1/address/btc/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/btc/validate')
      .send({ address: btcAddress })
      .expect(201);

    expect(response.body.isValid).toBe(true);
  });

  it('POST /api/v1/address/eth/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/eth/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: false, index: 0 },
      })
      .expect(201);

    expect(response.body.address).toBeDefined();
    expect(response.body.keys?.public).toBeDefined();
    expect(response.body.keys?.private).toBeDefined();
    ethAddress = response.body.address;
    ethPrivateKey = response.body.keys.private;
  });

  it('POST /api/v1/address/eth/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/eth/validate')
      .send({ address: ethAddress })
      .expect(201);

    expect(response.body.isValid).toBe(true);
  });

  it('POST /api/v1/address/tron/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/tron/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: false, index: 0 },
      })
      .expect(201);

    expect(response.body.address).toBeDefined();
    expect(response.body.keys?.public).toBeDefined();
    expect(response.body.keys?.private).toBeDefined();
    tronAddress = response.body.address;
    tronPrivateKey = response.body.keys.private;
  });

  it('POST /api/v1/address/tron/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/tron/validate')
      .send({ address: tronAddress })
      .expect(201);

    expect(response.body.isValid).toBe(true);
  });

  it('POST /api/v1/transaction/tron/build-transfer', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transfer')
      .send({
        ownerAddress: tronAddress,
        toAddress: tronAddress,
        amount: '1',
      })
      .expect(201);

    expect(response.body.rawJson).toBeDefined();
    tronRawJson = response.body.rawJson;
  });

  it('POST /api/v1/transaction/tron/build-transfer rejects invalid address', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transfer')
      .send({
        ownerAddress: 'invalid',
        toAddress: tronAddress,
        amount: '1',
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/build-transaction (trc20)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transaction')
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

    expect(response.body.rawJson).toBeDefined();
    const parsed = JSON.parse(response.body.rawJson);
    expect(parsed.triggerSmartContract).toBeDefined();
    tronTrc20RawJson = response.body.rawJson;
  });

  it('POST /api/v1/transaction/tron/build-transaction rejects invalid contract', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transaction')
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

  it('POST /api/v1/transaction/tron/sign-transfer', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign-transfer')
      .send({
        rawJson: tronRawJson,
        privateKey: tronPrivateKey,
      })
      .expect(201);

    expect(response.body.txId).toBeDefined();
    expect(response.body.signature).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/sign-transfer rejects smart contract', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign-transfer')
      .send({
        rawJson: JSON.stringify({
          raw_data: { contract: [{ type: 'TriggerSmartContract' }] },
        }),
        privateKey: '00'.repeat(32),
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/sign-transaction', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign-transaction')
      .send({
        rawJson: tronRawJson,
        privateKey: tronPrivateKey,
      })
      .expect(201);

    expect(response.body.txId).toBeDefined();
    expect(response.body.signature).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/sign-transaction (trc20)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign-transaction')
      .send({
        rawJson: tronTrc20RawJson,
        privateKey: tronPrivateKey,
      })
      .expect(201);

    expect(response.body.txId).toBeDefined();
    expect(response.body.signature).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/sign-transaction rejects invalid json', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/sign-transaction')
      .send({
        rawJson: '{invalid',
        privateKey: '00'.repeat(32),
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/btc/build-transaction', async () => {
    const core = walletCore.getCore();
    const { coinType } = resolveCoinConfig(core, Coin.BTC);
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
        toAddress: btcAddress,
        changeAddress: btcAddress,
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
      })
      .expect(201);

    expect(buildResponse.body.payload).toBeDefined();
    expect(buildResponse.body.plan?.amount).toBe('1000');

    const signResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/btc/sign-transaction')
      .send({
        payload: buildResponse.body.payload,
        privateKeys: [btcPrivateKey],
      })
      .expect(201);

    expect(signResponse.body.rawTx).toBeDefined();
    expect(signResponse.body.txId).toBeDefined();
    expect(signResponse.body.plan?.amount).toBe('1000');
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

    expect(buildResponse.body.payload).toBeDefined();

    const signResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/sign-transaction')
      .send({
        payload: buildResponse.body.payload,
        privateKey: ethPrivateKey,
      })
      .expect(201);

    expect(signResponse.body.rawTx).toBeDefined();
    expect(signResponse.body.signature?.v).toBeDefined();
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

    expect(buildResponse.body.payload).toBeDefined();

    const signResponse = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/sign-transfer')
      .send({
        payload: buildResponse.body.payload,
        privateKey: ethPrivateKey,
      })
      .expect(201);

    expect(signResponse.body.rawTx).toBeDefined();
    expect(signResponse.body.signature?.v).toBeDefined();
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
