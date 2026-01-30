import { ApiProperty } from '@nestjs/swagger';
import { BtcTransactionPlanResponseDto } from './btc-transaction-plan.response.dto';

export class BuildBtcTransactionResponseDto {
  @ApiProperty({
    example:
      '0a1e6263317177346872773076326b3077386d37797239713472367632783865366a7a6e64743378386c3268121e62633171326c336d346e3570367137723873397430753176327733783479357a366137623863396430651a04e8032201302a360a210a2000000000000000000000000000000000000000000000000000000000000000001001200',
    description: 'Signing payload from build step (hex)',
  })
  payload: string;

  @ApiProperty({ type: BtcTransactionPlanResponseDto })
  plan: BtcTransactionPlanResponseDto;
}
