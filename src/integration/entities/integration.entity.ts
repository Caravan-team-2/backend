import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IntegrationStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

registerEnumType(IntegrationStatus, {
  name: 'IntegrationStatus',
});

@ObjectType()
@Entity({ name: 'providers' })
export class Integration {
  @Field(() => ID)
  @PrimaryColumn('varchar', { length: 50 })
  id: string;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field(() => IntegrationStatus)
  @Column({
    type: 'enum',
    enum: IntegrationStatus,
    default: IntegrationStatus.PENDING,
  })
  status: IntegrationStatus;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  kafka_user?: string;

  @Column({ length: 255, nullable: true })
  kafka_password?: string;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  api_base_url?: string;

  @Field({ nullable: true })
  @Column({ length: 50, unique: true, nullable: true })
  topic_prefix?: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
