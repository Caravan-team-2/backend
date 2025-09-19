import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DriverRole } from 'src/constats/entities/constat-vehicle.entity';

@InputType()
export class CreateConstatVehicleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @Field(() => DriverRole)
  @IsNotEmpty()
  @IsEnum(DriverRole)
  driverRole: DriverRole;

  @Field()
  @IsNotEmpty()
  @IsString()
  insurerId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  insuranceNumber: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;
}
