import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

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

@Entity('kyc_details')
@ObjectType()
export class KycDetails {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  //TODO change
  @Column({ name: 'user_id', unique: true, nullable: true })
  @Field()
  userId: string;
  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => User, (user) => user.kycDetails, { onDelete: 'CASCADE' })
  user: Relation<User>;
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
