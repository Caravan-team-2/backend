import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateIntegrationInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  kafka_user?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  kafka_password?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  api_base_url?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  topic_prefix?: string;
}
