import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';
import { KycDetails } from './kyc-details.entity';
import { Constat } from '../../constats/entities/constat.entity';
import { Circumstance } from '../../constats/entities/circumstance.entity';
import { Damage } from '../../constats/entities/damage.entity';
import { Observation } from '../../constats/entities/observation.entity';
import { Signature } from '../../signature/entities/signature.entity';
import { UserInsurance } from 'src/user_insurrance/entities/user-insurance.entity';
import { InsuranceCompany } from 'src/insurrance_company/entities/insurance-company.entity';

export enum UserRole {
  USER = 'USER',
  ASSURER = 'ASSURER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Field()
  @Column()
  email: string;

  @Column({ name: 'phone_number', unique: true, nullable: true })
  @Field({ nullable: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ name: 'kyc_id', nullable: true })
  @Field({ nullable: true })
  kycId: string;

  @OneToOne(() => KycDetails, { cascade: true })
  @JoinColumn({ name: 'kyc_id' })
  @Field(() => KycDetails, { nullable: true })
  kycDetails: Relation<KycDetails>;

  @Column({ name: 'insurance_company_id', nullable: true })
  @Field({ nullable: true })
  insuranceCompanyId: string;

  @ManyToOne(() => InsuranceCompany, (company) => company.users)
  @JoinColumn({ name: 'insurance_company_id' })
  @Field(() => InsuranceCompany, { nullable: true })
  insuranceCompany: Relation<InsuranceCompany> | null;

  @Column({ name: 'is_kyc_verified', default: false })
  @Field()
  isKycVerified: boolean;
  @Field({ nullable: true })
  @Column({ nullable: true })
  job: string;

  @Column({ name: 'is_mail_verified', default: false })
  @Field()
  isMailVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @OneToMany(() => UserInsurance, (userInsurance) => userInsurance.user, {
    cascade: true,
  })
  @Field(() => [UserInsurance], { nullable: 'itemsAndList' })
  insurances: Relation<UserInsurance[]>;

  @OneToMany(() => Constat, (constat) => constat.driverA)
  @Field(() => [Constat], { nullable: 'itemsAndList' })
  constatsAsDriverA: Relation<Constat[]>;

  @OneToMany(() => Constat, (constat) => constat.driverB)
  @Field(() => [Constat], { nullable: 'itemsAndList' })
  constatsAsDriverB: Relation<Constat[]>;

  @OneToMany(() => Circumstance, (circumstance) => circumstance.driver)
  @Field(() => [Circumstance], { nullable: 'itemsAndList' })
  circumstances: Relation<Circumstance[]>;

  @OneToMany(() => Damage, (damage) => damage.driver)
  @Field(() => [Damage], { nullable: 'itemsAndList' })
  damages: Relation<Damage[]>;

  @OneToMany(() => Observation, (observation) => observation.driver)
  @Field(() => [Observation], { nullable: 'itemsAndList' })
  observations: Relation<Observation[]>;

  @OneToMany(() => Signature, (signature) => signature.driver)
  @Field(() => [Signature], { nullable: 'itemsAndList' })
  signatures: Relation<Signature[]>;
}
