import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateConstatVehicleInput } from './create-constat-vehicle.input';
import { CreateCircumstanceInput } from './create-circumstance.input';
import { CreateDamageInput } from './create-damage.input';
import { CreateObservationInput } from './create-observation.input';
import { CreateSignatureInput } from './create-signature.input';

@InputType()
export class CreateConstatInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  driverBId: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  dateTime: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  location: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  injuredCount: number;

  @Field(() => [CreateConstatVehicleInput])
  @ValidateNested({ each: true })
  @Type(() => CreateConstatVehicleInput)
  constatVehicles: CreateConstatVehicleInput[];

  @Field(() => [CreateCircumstanceInput])
  @ValidateNested({ each: true })
  @Type(() => CreateCircumstanceInput)
  circumstancesA: CreateCircumstanceInput[];

  @Field(() => [CreateCircumstanceInput])
  @ValidateNested({ each: true })
  @Type(() => CreateCircumstanceInput)
  circumstancesB: CreateCircumstanceInput[];

  @Field(() => [CreateDamageInput])
  @ValidateNested({ each: true })
  @Type(() => CreateDamageInput)
  damagesA: CreateDamageInput[];

  @Field(() => [CreateDamageInput])
  @ValidateNested({ each: true })
  @Type(() => CreateDamageInput)
  damagesB: CreateDamageInput[];

  @Field(() => [CreateObservationInput])
  @ValidateNested({ each: true })
  @Type(() => CreateObservationInput)
  observationsA: CreateObservationInput[];

  @Field(() => [CreateObservationInput])
  @ValidateNested({ each: true })
  @Type(() => CreateObservationInput)
  observationsB: CreateObservationInput[];

  @Field(() => [CreateSignatureInput])
  @ValidateNested({ each: true })
  @Type(() => CreateSignatureInput)
  signaturesA: CreateSignatureInput[];

  @Field(() => [CreateSignatureInput])
  @ValidateNested({ each: true })
  @Type(() => CreateSignatureInput)
  signaturesB: CreateSignatureInput[];
}