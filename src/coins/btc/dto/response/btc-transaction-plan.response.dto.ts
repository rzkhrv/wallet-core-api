import { ApiProperty } from '@nestjs/swagger';

export class BtcTransactionPlanResponseDto {
  @ApiProperty({ example: '10000' })
  amount: string;

  @ApiProperty({ example: '20000' })
  availableAmount: string;

  @ApiProperty({ example: '150' })
  fee: string;

  @ApiProperty({ example: '9850' })
  change: string;
}
