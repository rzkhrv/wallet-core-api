import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class TronDerivationRequestDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  account: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  change: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  index: number;
}
