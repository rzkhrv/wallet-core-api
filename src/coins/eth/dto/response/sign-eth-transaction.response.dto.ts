import { ApiProperty } from '@nestjs/swagger';
import { EthTransactionSignatureResponseDto } from './eth-transaction-signature.response.dto';

export class SignEthTransactionResponseDto {
  @ApiProperty({
    example:
      '0xf86b808504a817c80082520894111111111111111111111111111111111111111188038d7ea4c68000801ba0b1c02e767bf38c5d1e36c401265c7d1cd1d7b73d6f8f4b69edfd4b8f1b7a2a06e17d8d69c126ef2c3f455f3c5fb6b9b6b7f2a2c7a2b7c6ad1f6f1c7b3a1d4',
  })
  rawTx: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00',
  })
  preHash: string;

  @ApiProperty({ example: '' })
  data: string;

  @ApiProperty({ type: EthTransactionSignatureResponseDto })
  signature: EthTransactionSignatureResponseDto;
}
