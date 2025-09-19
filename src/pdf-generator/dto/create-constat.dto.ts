import { ValidateNested } from 'class-validator';
import { DriverDto } from './driver.dto';
import { Type } from 'class-transformer';
import { AccidentDto } from './accident.dto';

export class CreateConstatDto {
  @ValidateNested()
  @Type(() => DriverDto)
  driverA: DriverDto;

  @ValidateNested()
  @Type(() => DriverDto)
  driverB: DriverDto;

  @ValidateNested()
  @Type(() => AccidentDto)
  accident: AccidentDto;
}
