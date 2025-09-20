import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Constat } from '../../constats/entities/constat.entity';
import { User } from '../../user/entities/user.entity';

export enum SignatureType {
  VISUAL = 'VISUAL',
  CRYPTO = 'CRYPTO',
}

registerEnumType(SignatureType, { name: 'SignatureType' });

@ObjectType()
@Entity('signatures')
export class Signature {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'constat_id' })
  @Field()
  constatId: string;

  @ManyToOne(() => Constat, (constat) => constat.signatures)
  @JoinColumn({ name: 'constat_id' })
  @Field(() => Constat)
  constat: Relation<Constat>;

  @Column({ name: 'driver_id' })
  @Field()
  driverId: string;

  @ManyToOne(() => User, (user) => user.signatures)
  @JoinColumn({ name: 'driver_id' })
  @Field(() => User)
  driver: Relation<User>;

  @Column({ type: 'text' })
  @Field()
  visualSignature: string;

  @Column({ type: 'text' })
  @Field()
  cryptoSignature: string;

  @Column({ name: 'signature_data', type: 'text' })
  @Field()
  signatureData: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;
}
