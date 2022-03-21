import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1647855096195 implements MigrationInterface {
    name = 'Test1647855096195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roll" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "deliveryType" character varying, "closingDate" TIMESTAMP, "pictureNumber" integer DEFAULT '25', "remainingPictures" integer DEFAULT '25', "isOpen" boolean NOT NULL DEFAULT true, "accessCode" character varying DEFAULT 'AAA111', "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91319c8ec656321a667986a83c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "avatarCloudinaryPublicId" character varying DEFAULT '', "phoneNumber" character varying NOT NULL, "tokenVersion" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participant" ("id" SERIAL NOT NULL, "phoneNumber" character varying NOT NULL, "role" character varying DEFAULT 'participant', "isActive" boolean NOT NULL DEFAULT false, "isRollAdmin" boolean NOT NULL DEFAULT false, "roll_id" integer NOT NULL, "user_id" integer, "pictureCount" integer DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "picture" ("id" SERIAL NOT NULL, "cloudinaryPublicId" character varying NOT NULL, "height" integer, "width" integer, "participant_id" integer NOT NULL, "roll_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_31ccf37c74bae202e771c0c2a38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_b8e83ccdd1328022bd98f54bf55" FOREIGN KEY ("roll_id") REFERENCES "roll"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_7916773e236a9cfc13d59f96a4a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "picture" ADD CONSTRAINT "FK_83567c317482ab233b4025aca07" FOREIGN KEY ("participant_id") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "picture" ADD CONSTRAINT "FK_884d0b9dc7bc7a7c34598d366f4" FOREIGN KEY ("roll_id") REFERENCES "roll"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "picture" DROP CONSTRAINT "FK_884d0b9dc7bc7a7c34598d366f4"`);
        await queryRunner.query(`ALTER TABLE "picture" DROP CONSTRAINT "FK_83567c317482ab233b4025aca07"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_7916773e236a9cfc13d59f96a4a"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b8e83ccdd1328022bd98f54bf55"`);
        await queryRunner.query(`DROP TABLE "picture"`);
        await queryRunner.query(`DROP TABLE "participant"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "roll"`);
    }

}
