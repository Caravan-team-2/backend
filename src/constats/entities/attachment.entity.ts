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

export enum AttachmentType {
  PHOTO = 'PHOTO',
  SKETCH = 'SKETCH',
  DOCUMENT = 'DOCUMENT',
}

export enum AttachmentStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

registerEnumType(AttachmentType, { name: 'AttachmentType' });
registerEnumType(AttachmentStatus, { name: 'AttachmentStatus' });

@ObjectType()
@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

 
  @Column({ type: 'enum', enum: AttachmentType })
  @Field(() => AttachmentType)
  type: AttachmentType;

  @Column({
    type: 'enum',
    enum: AttachmentStatus,
    default: AttachmentStatus.PENDING,
  })
  @Field(() => AttachmentStatus)
  status: AttachmentStatus;

  @Column()
  @Field()
  url: string;
}

