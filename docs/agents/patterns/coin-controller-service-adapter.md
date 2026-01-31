# Pattern: coin controller → service → adapter

## Context
Coin endpoints follow a consistent Controller → Service → Adapter flow.

## Goal
Provide a copy/paste-friendly shape for new coin endpoints.

## Steps
1. Define request/response DTOs under `src/coins/<coin>/dto/{request,response}`.
2. Add a controller that calls a service method and applies Swagger decorators.
3. Implement the service to map API DTOs to adapter DTOs and call the adapter.
4. Keep wallet-core logic inside adapters only.

## Example
```ts
// src/coins/btc/btc-address.controller.ts
@ApiTags('BTC Address')
@Controller('api/v1/address/btc')
export class BtcAddressController {
  constructor(private readonly btcAddressService: BtcAddressService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate BTC address' })
  generate(@Body() body: GenerateBtcAddressRequestDto): GenerateBtcAddressResponseDto {
    return this.btcAddressService.generate(body);
  }
}
```

```ts
// src/coins/btc/service/btc-address.service.ts
@Injectable()
export class BtcAddressService {
  constructor(private readonly btcAddressAdapter: BtcAddressAdapter) {}

  generate(request: GenerateBtcAddressRequestDto): GenerateBtcAddressResponseDto {
    const adapterRequest: BtcAddressGenerateAdapterRequest = {
      mnemonic: { value: request.mnemonic.value, passphrase: request.mnemonic.passphrase ?? '' },
      derivation: {
        account: request.derivation.account,
        change: Number(request.derivation.change),
        index: request.derivation.index,
      },
    };
    return this.btcAddressAdapter.generate(adapterRequest);
  }
}
```

## Verification
- Controller routes are under `/api/v1/...`.
- Services only map DTOs and call adapters.
- Adapter contains wallet-core calls and error wrapping.

## References
- `src/coins/btc/btc-address.controller.ts`
- `src/coins/btc/service/btc-address.service.ts`
- `src/adapter/coins/btc/btc-address.adapter.ts`

Last updated: 2026-01-31
