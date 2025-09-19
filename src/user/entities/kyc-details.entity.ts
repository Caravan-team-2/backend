import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

export enum LicenseType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

registerEnumType(Sex, { name: 'Sex' });
registerEnumType(LicenseType, { name: 'LicenseType' });

@ObjectType()
@Entity('kyc_details')
export class KycDetails {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  nin: number;

  @Column({ name: 'first_name' })
  @Field()
  firstName: string;

  @Column({ name: 'last_name' })
  @Field()
  lastName: string;

  @Column()
  @Field()
  dob: Date;

  @Column({ type: 'enum', enum: Sex })
  @Field(() => Sex)
  sex: Sex;

  @Column({ name: 'place_of_birth' })
  @Field()
  placeOfBirth: string;

  @Column({ name: 'issued_at' })
  @Field()
  issuedAt: Date;

  @Column({ name: 'expires_at' })
  @Field()
  expiresAt: Date;

  @Column({ name: 'license_type', type: 'enum', enum: LicenseType })
  @Field(() => LicenseType)
  licenseType: LicenseType;

  @Column({ name: 'license_number' })
  @Field()
  licenseNumber: string;
}
