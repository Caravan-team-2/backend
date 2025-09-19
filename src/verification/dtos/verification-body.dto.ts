import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyIdentityDto {
  @ApiProperty({
    description: 'The ID of the document to verify',
    example: 'doc_12345',
  })
  @IsString()
  documentId: string;
}
