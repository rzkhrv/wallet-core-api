import { ApiProperty } from '@nestjs/swagger';

export class BtcAddressKeysResponseDto {
  @ApiProperty({
    example:
      '02c1e7a7b0d0a4a6f04c8a63f9c3d4b19f6f8b42b6d5d8c0d1e1f2a3b4c5d6e7f8',
  })
  public: string;

  @ApiProperty({
    example: 'e8f32e723decf4051aefac8e2c3b1f9d9ad7a2b9f19e0f8f6a2b3c4d5e6f7081',
  })
  private: string;
}
