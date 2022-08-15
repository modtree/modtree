import { MigrationInterface, QueryRunner } from 'typeorm'

export class dropAuth01658237713750 implements MigrationInterface {
  name = 'dropAuth01658237713750'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authZeroId"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "authZeroId" character varying NOT NULL DEFAULT ''`
    )
  }
}
