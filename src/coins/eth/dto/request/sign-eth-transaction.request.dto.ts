import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignEthTransactionRequestDto {
  @ApiProperty({
    example:
      '0a020801120208001a0208c8220210e0292a2a3078313131313131313131313131313131313131313131313131313131313131313131313131313131320b0a090a0708f0cba1f4c004',
    description: 'Signing payload from build step (hex)',
  })
  @Matches(/^(0x)?([0-9a-fA-F]{2})+$/)
  @IsString()
  @IsNotEmpty()
  payload: string;

  @ApiProperty({
    example: '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    description: 'Sender private key (hex)',
  })
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/)
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
