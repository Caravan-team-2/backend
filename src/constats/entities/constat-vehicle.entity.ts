import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Constat } from './constat.entity';
import { Vehicle } from '../../user/entities/vehicle.entity';
import { InsuranceCompany } from '../../insurrance_company/entities/insurance-company.entity';

export enum DriverRole {
  A = 'A',
  B = 'B',
}

registerEnumType(DriverRole, { name: 'DriverRole' });

@ObjectType()
@Entity('constat_vehicles')
export class ConstatVehicle {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'constat_id' })
  @Field()
  constatId: string;

  @ManyToOne(() => Constat, (constat) => constat.constatVehicles)
  @JoinColumn({ name: 'constat_id' })
  @Field(() => Constat)
  constat: Relation<Constat>;

  @Column({ name: 'vehicle_id' })
  @Field()
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.constatVehicles)
  @JoinColumn({ name: 'vehicle_id' })
  @Field(() => Vehicle)
  vehicle: Relation<Vehicle>;

  @Column({ name: 'driver_role', type: 'enum', enum: DriverRole })
  @Field(() => DriverRole)
  driverRole: DriverRole;

  @Column({ name: 'insurer_id' })
  @Field()
  insurerId: string;

  @ManyToOne(
    () => InsuranceCompany,
    (insuranceCompany) => insuranceCompany.constatVehicle,
  )
  @JoinColumn({ name: 'insurer_id' })
  @Field(() => InsuranceCompany)
  insurer: Relation<InsuranceCompany>;

  @Column({ name: 'insurance_number' })
  @Field()
  insuranceNumber: string;

  @Column({ name: 'license_number' })
  @Field()
  licenseNumber: string;
}
