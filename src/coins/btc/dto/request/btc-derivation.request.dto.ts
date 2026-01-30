import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class BtcDerivationRequestDto {
  @ApiProperty({ example: 0, description: 'BIP44 account index' })
  @IsInt()
  @Min(0)
  account: number;

  @ApiProperty({
    example: false,
    description: 'Change chain flag (false = external, true = change)',
  })
  @IsBoolean()
  change: boolean;

  @ApiProperty({ example: 0, description: 'Address index' })
  @IsInt()
  @Min(0)
  index: number;
}
