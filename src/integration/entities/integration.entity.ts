import { Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Integration {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //So our server can communicate with the parsing layer servers
  @Column({ nullable: true, unique: true })
  @Field({ nullable: true })
  apiKey: string;
  @Column({ unique: true })
  @Field()
  topicPrefix: string;
}
