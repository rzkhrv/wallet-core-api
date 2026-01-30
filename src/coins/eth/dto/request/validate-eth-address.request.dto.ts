import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class ValidateEthAddressRequestDto {
  @ApiProperty({ example: '0x1111111111111111111111111111111111111111' })
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  address: string;
}
