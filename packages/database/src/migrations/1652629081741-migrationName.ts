import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1652629081741 implements MigrationInterface {
    name = 'migrationName1652629081741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_modules_completed_module\` (\`userId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_8ce9d16fbf596d080147527959\` (\`userId\`), INDEX \`IDX_bdce7ef837336e404ec8b307de\` (\`moduleId\`), PRIMARY KEY (\`userId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_modules_doing_module\` (\`userId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_4b333af5e5071937f7eba70c5d\` (\`userId\`), INDEX \`IDX_a0ac2a1563d827af2e4ccf2442\` (\`moduleId\`), PRIMARY KEY (\`userId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`modulesCompleted\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`modulesDoing\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_completed_module\` ADD CONSTRAINT \`FK_8ce9d16fbf596d0801475279591\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_modules_completed_module\` ADD CONSTRAINT \`FK_bdce7ef837336e404ec8b307de3\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` ADD CONSTRAINT \`FK_4b333af5e5071937f7eba70c5d0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` ADD CONSTRAINT \`FK_a0ac2a1563d827af2e4ccf24420\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` DROP FOREIGN KEY \`FK_a0ac2a1563d827af2e4ccf24420\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` DROP FOREIGN KEY \`FK_4b333af5e5071937f7eba70c5d0\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_completed_module\` DROP FOREIGN KEY \`FK_bdce7ef837336e404ec8b307de3\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_completed_module\` DROP FOREIGN KEY \`FK_8ce9d16fbf596d0801475279591\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`modulesDoing\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`modulesCompleted\` json NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_a0ac2a1563d827af2e4ccf2442\` ON \`user_modules_doing_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_4b333af5e5071937f7eba70c5d\` ON \`user_modules_doing_module\``);
        await queryRunner.query(`DROP TABLE \`user_modules_doing_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_bdce7ef837336e404ec8b307de\` ON \`user_modules_completed_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_8ce9d16fbf596d080147527959\` ON \`user_modules_completed_module\``);
        await queryRunner.query(`DROP TABLE \`user_modules_completed_module\``);
    }

}
