import { ApiProperty } from '@nestjs/swagger';

export class TronAddressKeysResponseDto {
  @ApiProperty({ example: '03a34c9d1e7f...' })
  public: string;

  @ApiProperty({ example: '1f4b9a2c3d4e...' })
  private: string;
}
