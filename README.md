# Wallet Core API

REST API for wallet-core operations built with NestJS and `@trustwallet/wallet-core`.

## Features

- Mnemonic generation and validation (BIP39)
- BTC and TRON address generation/validation
- BTC transaction building/signing
- ETH ERC20 transfer signing
- TRON transaction building/signing (params or raw JSON)

## Requirements

- Node.js 18+ recommended

## Setup

```bash
npm install
```

## Run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

## API

Base URL: `/api/v1`

Swagger UI: `/api`

All request bodies are strictly validated; extra fields are rejected.

### Mnemonic

- `POST /api/v1/mnemonic/generate`

Request:
```json
{
  "strength": 128,
  "passphrase": "optional"
}
```

Response:
```json
{
  "mnemonic": "abandon abandon ...",
  "isPassphraseUsed": false,
  "strengthBits": 128
}
```

- `POST /api/v1/mnemonic/validate`

Request:
```json
{
  "mnemonic": "abandon abandon ...",
  "passphrase": "optional"
}
```

Response:
```json
{
  "isValid": true
}
```

### Addresses

- `POST /api/v1/address/btc/generate`
- `POST /api/v1/address/eth/generate`
- `POST /api/v1/address/tron/generate`

Request:
```json
{
  "mnemonic": {
    "value": "abandon abandon ...",
    "passphrase": "optional"
  },
  "derivation": {
    "account": 0,
    "change": 0,
    "index": 0
  }
}
```

Response:
```json
{
  "address": "...",
  "keys": {
    "public": "...",
    "private": "..."
  },
  "derivation": {
    "path": "m/...",
    "purpose": 84,
    "coin": 0,
    "account": 0,
    "change": 0,
    "index": 0
  }
}
```

- `POST /api/v1/address/btc/validate`
- `POST /api/v1/address/eth/validate`
- `POST /api/v1/address/tron/validate`

Request:
```json
{
  "address": "..."
}
```

Response:
```json
{
  "isValid": true
}
```

### Transactions

- `POST /api/v1/transaction/btc/build-transaction`

Request:
```json
{
  "toAddress": "...",
  "changeAddress": "...",
  "amount": "10000",
  "byteFee": "10",
  "utxos": [
    {
      "txid": "...",
      "vout": 0,
      "amount": "15000",
      "scriptPubKey": "...",
      "reverseTxId": true
    }
  ],
  "privateKeys": ["..."]
}
```

Response:
```json
{
  "rawTx": "...",
  "txId": "...",
  "plan": {
    "amount": "10000",
    "availableAmount": "15000",
    "fee": "...",
    "change": "..."
  }
}
```

- `POST /api/v1/transaction/eth/build-transfer`

Request:
```json
{
  "chainId": "1",
  "nonce": "0",
  "gasPrice": "20000000000",
  "gasLimit": "60000",
  "toAddress": "0x...",
  "tokenContract": "0x...",
  "amount": "1000000",
  "privateKey": "..."
}
```

Response:
```json
{
  "rawTx": "...",
  "preHash": "...",
  "data": "...",
  "signature": {
    "v": "...",
    "r": "...",
    "s": "..."
  }
}
```

- `POST /api/v1/transaction/tron/build-transfer`
- `POST /api/v1/transaction/tron/build-transaction`

Request:
```json
{
  "transferType": "trx",
  "ownerAddress": "T...",
  "toAddress": "T...",
  "amount": "1000000",
  "timestamp": "1738253400000",
  "expiration": "1738253460000",
  "privateKey": "..."
}
```
Notes:
- `transferType` can be `trx` or `trc10` (TRC10 requires `assetName`).
- `build-transfer` always uses `trx`.

Response:
```json
{
  "txId": "...",
  "signature": "...",
  "refBlockBytes": "...",
  "refBlockHash": "...",
  "signedJson": "..."
}
```

- `POST /api/v1/transaction/tron/sign-transfer`
- `POST /api/v1/transaction/tron/sign-transaction`

Naming convention for signing endpoints:
- `/api/v1/transaction/<coin>/sign-transfer` (if the coin supports contract/token transfers)
- `/api/v1/transa/ction/<coin>/sign-transaction`

Request:
```json
{
  "rawJson": "{\"visible\":true,...}",
  "privateKey": "...",
  "txId": "optional"
}
```

Response:
```json
{
  "txId": "...",
  "signature": "...",
  "refBlockBytes": "...",
  "refBlockHash": "...",
  "signedJson": "..."
}
```

## Configuration

- `PORT` (optional, default: 3000)

## Health

- `GET /` returns a basic service health payload.
