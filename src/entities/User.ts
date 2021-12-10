import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
import { Participant } from "./Participant";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Column()
  password!: string;

  @Field()
  @Column({ nullable: true, default: "" })
  avatarCloudinaryPublicId?: string;

  @Field()
  @Column()
  phoneNumber!: string;

  @Field()
  @Column("int", { default: 0 })
  tokenVersion: number;

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
