import { ApiProperty } from '@nestjs/swagger';

export class BuildEthTransactionResponseDto {
  @ApiProperty({
    example:
      '0a020801120208001a0208c8220210e0292a2a3078313131313131313131313131313131313131313131313131313131313131313131313131313131320b0a090a0708f0cba1f4c004',
    description: 'Signing payload from build step (hex)',
  })
  payload: string;
}
