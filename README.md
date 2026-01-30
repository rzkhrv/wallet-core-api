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

## Configuration

- `PORT` (optional, default: 3000)

## Health

- `GET /` returns a basic service health payload.
