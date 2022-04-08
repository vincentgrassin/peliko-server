import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPushToken1649410023772 implements MigrationInterface {
    name = 'AddPushToken1649410023772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pushNotificationToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushNotificationToken"`);
    }

}
