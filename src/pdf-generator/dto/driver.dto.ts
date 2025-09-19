import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { VehicleDto } from './vehicle.dto';
import { Type } from 'class-transformer';

export class DriverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  license: string;

  @IsString()
  @IsNotEmpty()
  insurance: string;

  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @IsOptional()
  @IsString()
  signatureUrl?: string;
}
