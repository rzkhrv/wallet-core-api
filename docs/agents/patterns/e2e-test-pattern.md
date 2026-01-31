# Pattern: e2e test flow

## Context
E2E tests in this repo validate real request flows against the Nest app.

## Goal
Provide a consistent structure for new e2e coverage.

## Steps
1. Use `Test.createTestingModule` with `AppModule`.
2. Apply global filters and validation pipe for parity with runtime.
3. Use `supertest` to hit endpoints and assert response shape.

## Example
```ts
// test/app.e2e-spec.ts
beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.init();
});

it('GET /', async () => {
  const response = await request(app.getHttpServer()).get('/').expect(200);
  expect(response.body.status).toBe('ok');
});
```

## Verification
- Tests follow Arrange-Act-Assert and use real HTTP calls.
- E2E tests are placed under `test/*.e2e-spec.ts`.

## References
- `test/app.e2e-spec.ts`
- `test/jest-e2e.json`

Last updated: 2026-01-31
