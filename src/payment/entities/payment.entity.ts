import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',

}
  enum TransactionType {
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',
}
  
registerEnumType(TransactionType, { name: 'TransactionType' });
registerEnumType(TransactionStatus, { name: 'TransactionStatus' });

@ObjectType()
@Entity({ name: 'transactions' })
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // the user who made the transaction
  @Column()
  userId: string;
  // a dzd amount in string format
  @Field()
  @Column()
  amount: string;
  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType; //"EXTERNAL" | "INTERNAL"
  // this is payment gateway transaction id or our internal transaction id
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_id: string;
  // this is our order id stored in the gateway's database
  @Column()
  @Field()
  order_number: string;
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Field(() => TransactionStatus)
  status: TransactionStatus;
  @Column({ nullable: true })
  error_message: string;
  @Field()
  @Column()
  form_url: string;
}
