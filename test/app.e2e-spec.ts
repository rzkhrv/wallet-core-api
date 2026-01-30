import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/errors/api-exception.filter';

describe('Wallet Core API (e2e)', () => {
  let app: INestApplication<App>;
  let mnemonic: string;
  let address: string;
  let ethAddress: string;

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
  });

  afterAll(async () => {
    await app.close();
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
        derivation: { account: 0, change: 0, index: 0 },
      })
      .expect(201);

    expect(response.body.address).toBeDefined();
    expect(response.body.keys?.public).toBeDefined();
    expect(response.body.keys?.private).toBeDefined();
    address = response.body.address;
  });

  it('POST /api/v1/address/btc/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/btc/validate')
      .send({ address })
      .expect(201);

    expect(response.body.isValid).toBe(true);
  });

  it('POST /api/v1/address/eth/generate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/eth/generate')
      .send({
        mnemonic: { value: mnemonic, passphrase: '' },
        derivation: { account: 0, change: 0, index: 0 },
      })
      .expect(201);

    expect(response.body.address).toBeDefined();
    expect(response.body.keys?.public).toBeDefined();
    expect(response.body.keys?.private).toBeDefined();
    ethAddress = response.body.address;
  });

  it('POST /api/v1/address/eth/validate', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/address/eth/validate')
      .send({ address: ethAddress })
      .expect(201);

    expect(response.body.isValid).toBe(true);
  });
});
