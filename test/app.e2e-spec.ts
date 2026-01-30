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
  });

  it('POST /api/v1/address/tron/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/tron/validate')
      .send({ address: tronAddress })
      .expect(201);

    expect(response.body.isValid).toBe(true);
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

    const response = await request(app.getHttpServer())
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
        privateKeys: [btcPrivateKey],
      })
      .expect(201);

    expect(response.body.rawTx).toBeDefined();
    expect(response.body.txId).toBeDefined();
    expect(response.body.plan?.amount).toBe('1000');
  });

  it('POST /api/v1/transaction/eth/build-transaction', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/build-transaction')
      .send({
        chainId: '1',
        nonce: '0',
        gasPrice: '20000000000',
        gasLimit: '21000',
        toAddress: ethAddress,
        amount: '1000000000000000',
        privateKey: ethPrivateKey,
      })
      .expect(201);

    expect(response.body.rawTx).toBeDefined();
    expect(response.body.signature?.v).toBeDefined();
  });

  it('POST /api/v1/transaction/eth/build-transfer', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transaction/eth/build-transfer')
      .send({
        chainId: '1',
        nonce: '0',
        gasPrice: '20000000000',
        gasLimit: '60000',
        toAddress: ethAddress,
        tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        amount: '1000000',
        privateKey: ethPrivateKey,
      })
      .expect(201);

    expect(response.body.rawTx).toBeDefined();
    expect(response.body.signature?.v).toBeDefined();
  });

  it('POST /api/v1/transaction/tron/build-transfer rejects smart contract', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transfer')
      .send({
        rawJson: JSON.stringify({
          raw_data: { contract: [{ type: 'TriggerSmartContract' }] },
        }),
        privateKey: '00'.repeat(32),
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/build-smart-contract rejects transfer', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-smart-contract')
      .send({
        rawJson: JSON.stringify({
          raw_data: { contract: [{ type: 'TransferContract' }] },
        }),
        privateKey: '00'.repeat(32),
      })
      .expect(400);
  });

  it('POST /api/v1/transaction/tron/build-transaction rejects invalid json', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transaction/tron/build-transaction')
      .send({
        rawJson: '{invalid',
        privateKey: '00'.repeat(32),
      })
      .expect(400);
  });
});
