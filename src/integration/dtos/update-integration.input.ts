import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { CreateIntegrationInput } from './create-integration.input';
import { IsEnum, IsOptional } from 'class-validator';
import { IntegrationStatus } from '../entities/integration.entity';

@InputType()
export class UpdateIntegrationInput extends PartialType(
  OmitType(CreateIntegrationInput, ['id'] as const),
) {
  @Field(() => IntegrationStatus, { nullable: true })
  @IsEnum(IntegrationStatus)
  @IsOptional()
  status?: IntegrationStatus;
}
