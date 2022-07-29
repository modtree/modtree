import { MigrationInterface, QueryRunner } from 'typeorm'

export class cypressRuns1659110872452 implements MigrationInterface {
  name = 'cypressRuns1659110872452'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cypress_run" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file" text NOT NULL, "timestamp" integer NOT NULL, "gitHash" text NOT NULL, "pass" boolean NOT NULL, CONSTRAINT "PK_be242e4a4ba0aaf4b2de045f1b0" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cypress_run"`)
  }
}
