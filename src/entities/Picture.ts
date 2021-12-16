import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
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

  @Column({ name: "participant_id" })
  participantId: number;

  @Field(() => Participant)
  @ManyToOne(() => Participant, (participant) => participant.pictures, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinColumn({ name: "participant_id" })
  participant: Participant;

  @Column({ name: "roll_id" })
  rollId: number;

  @Field(() => Roll)
  @ManyToOne(() => Roll, (roll) => roll.pictures, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinColumn({ name: "roll_id" })
  roll: Roll;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
