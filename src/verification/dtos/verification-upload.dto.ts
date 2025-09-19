import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum DocumentType {
  ID_FRONT = 'id_front',
  ID_BACK = 'id_back',
}

export class VerificationUploadDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  type: DocumentType;
}
