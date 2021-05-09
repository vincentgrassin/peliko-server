import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import { Participant } from "./Participant";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  password!: string;

  @Field()
  @Column()
  phoneNumber!: string;

  @Field(() => [Participant])
  @OneToMany(() => Participant, (participant) => participant.user, {
    cascade: true,
  })
  participants: Participant[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

@InputType()
export class UserInputType {
  @Field()
  name!: string;

  @Field()
  phoneNumber!: string;

  @Field()
  password!: string;
}
