import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Participant } from "./Participant";
import { Roll } from "./Roll";

@ObjectType()
@Entity()
export class Picture extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  cloudinaryPublicId!: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  height: number;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  width: number;

  @Field(() => Participant)
  @ManyToOne(() => Participant, (participant) => participant.pictures, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  participant: Participant;

  @Field(() => Roll)
  @ManyToOne(() => Roll, (roll) => roll.pictures, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  roll: Roll;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
