import { ApiProperty } from '@nestjs/swagger';
import { BtcTransactionPlanResponseDto } from './btc-transaction-plan.response.dto';

export class BtcBuildTransactionUtxoResponseDto {
  @ApiProperty({
    example: 'e3c0f7b6a7c9d8e1f2a3b4c5d6e7f8090a1b2c3d4e5f60718293a4b5c6d7e8f9',
    description: 'UTXO transaction id (txid)',
  })
  txid: string;

  @ApiProperty({ example: 0, description: 'UTXO output index (vout)' })
  vout: number;

  @ApiProperty({
    example: '10000',
    description: 'UTXO amount in satoshis',
  })
  amount: string;

  @ApiProperty({
    example: 'ABTYPg==',
    description: 'UTXO scriptPubKey (base64)',
  })
  scriptPubKey: string;
}

export class BtcBuildTransactionOutputResponseDto {
  @ApiProperty({
    example: 'bc1qw4hrw0v2k0w8m7yr9q4r6v2x8e6jzndt3x8l2h',
    description: 'Output BTC address',
  })
  address: string;

  @ApiProperty({
    example: '10000',
    description: 'Output amount in satoshis',
  })
  amount: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if this output is the change output',
  })
  isChange: boolean;
}

export class BtcBuildTransactionIntentResponseDto {
  @ApiProperty({
    type: [BtcBuildTransactionOutputResponseDto],
    description: 'Resolved outputs, including change',
  })
  outputs: BtcBuildTransactionOutputResponseDto[];

  @ApiProperty({
    example: '10',
    description: 'Fee per byte in satoshis',
  })
  byteFee: string;

  @ApiProperty({ type: [BtcBuildTransactionUtxoResponseDto] })
  utxos: BtcBuildTransactionUtxoResponseDto[];

  @ApiProperty({ example: 1, description: 'Resolved SIGHASH type' })
  hashType: number;

  @ApiProperty({ type: BtcTransactionPlanResponseDto })
  plan: BtcTransactionPlanResponseDto;
}

export class BuildBtcTransactionResponseDto {
  @ApiProperty({
    example:
      '0a1e6263317177346872773076326b3077386d37797239713472367632783865366a7a6e64743378386c3268121e62633171326c336d346e3570367137723873397430753176327733783479357a366137623863396430651a04e8032201302a360a210a2000000000000000000000000000000000000000000000000000000000000000001001200',
    description: 'Signing payload from build step (hex)',
  })
  payload: string;

  @ApiProperty({ type: BtcBuildTransactionIntentResponseDto })
  transaction: BtcBuildTransactionIntentResponseDto;
}
