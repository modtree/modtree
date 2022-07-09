import { MigrationInterface, QueryRunner } from 'typeorm'

export class untitled1657335081864 implements MigrationInterface {
  name = 'untitled1657335081864'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "module" DROP COLUMN "newProperty"
        `)
    await queryRunner.query(`
            ALTER TABLE "degree"
            ADD "newProp" text NOT NULL DEFAULT 'meme'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "degree" DROP COLUMN "newProp"
        `)
    await queryRunner.query(`
            ALTER TABLE "module"
            ADD "newProperty" text NOT NULL DEFAULT 'helloworld'
        `)
  }
}
