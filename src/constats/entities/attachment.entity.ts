import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AttachmentType {
  PHOTO = 'PHOTO',
  SKETCH = 'SKETCH',
  DOCUMENT = 'DOCUMENT',
}

export enum AttachmentStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  UPLOADING = 'UPLOADING',
}

registerEnumType(AttachmentType, { name: 'AttachmentType' });
registerEnumType(AttachmentStatus, { name: 'AttachmentStatus' });

@ObjectType()
@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  jobId: string;
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

  @Column({ name: 'public_id', nullable: true })
  @Field({ nullable: true })
  publicId: string;
  @Column({ nullable: true })
  filename: string;
  @Column({ name: 'mime_type', nullable: true })
  @Field({ nullable: true })
  mimeType: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  size: number;

  @Column()
  @Field()
  url: string;
  @Column({ name: 'error_message', nullable: true })
  @Field({ nullable: true })
  errorMessage: string;
  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt: Date;
}
