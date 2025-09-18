import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column({ unique: true })
  @Field()
  email: string;
  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  password: string;
  @Column({ default: false })
  @Field()
  isMailVerified: boolean;
}
