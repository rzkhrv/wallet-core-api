import { ApiProperty } from '@nestjs/swagger';
import { EthTransactionSignatureResponseDto } from './eth-transaction-signature.response.dto';

export class BuildEthErc20TransferResponseDto {
  @ApiProperty({
    example:
      '0xf86c808504a817c80082520894a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4880b844a9059cbb000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000f4240',
  })
  rawTx: string;

  @ApiProperty({
    example: 'f7a1f5c2b1d3e4f5a6b7c8d9e0f1121314151617181920212223242526272829',
  })
  preHash: string;

  @ApiProperty({
    example:
      'a9059cbb000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000f4240',
  })
  data: string;

  @ApiProperty({ type: EthTransactionSignatureResponseDto })
  signature: EthTransactionSignatureResponseDto;
}
