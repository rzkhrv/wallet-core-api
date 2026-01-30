import { ApiProperty } from '@nestjs/swagger';
import { BtcTransactionPlanResponseDto } from './btc-transaction-plan.response.dto';

export class SignBtcTransactionResponseDto {
  @ApiProperty({ example: '0200000001...' })
  rawTx: string;

  @ApiProperty({
    example: 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5060708090a0b0c0d0e0f10111213141516',
  })
  txId: string;

  @ApiProperty({ type: BtcTransactionPlanResponseDto })
  plan: BtcTransactionPlanResponseDto;
}
