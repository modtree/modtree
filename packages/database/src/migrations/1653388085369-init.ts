import { MigrationInterface, QueryRunner } from "typeorm";

export class init1653388085369 implements MigrationInterface {
    name = 'init1653388085369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`displayName\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`matriculationYear\` int NOT NULL, \`graduationYear\` int NOT NULL, \`graduationSemester\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`degree\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`DAG\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(36) NULL, \`degreeId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_modules_done_module\` (\`userId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_6e9ccdc3f581b4d4ef99d82f37\` (\`userId\`), INDEX \`IDX_d41a87d35a5c1008452c44bea3\` (\`moduleId\`), PRIMARY KEY (\`userId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_modules_doing_module\` (\`userId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_4b333af5e5071937f7eba70c5d\` (\`userId\`), INDEX \`IDX_a0ac2a1563d827af2e4ccf2442\` (\`moduleId\`), PRIMARY KEY (\`userId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`degree_modules_module\` (\`degreeId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_a732fecaebb04f713be62f7afd\` (\`degreeId\`), INDEX \`IDX_670cd15a366ceb0e0834f507ee\` (\`moduleId\`), PRIMARY KEY (\`degreeId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dag_modules_placed_module\` (\`dAGId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_0ca97d3434421eaf55b79847ce\` (\`dAGId\`), INDEX \`IDX_67d9d483ba4bf496707d9854c0\` (\`moduleId\`), PRIMARY KEY (\`dAGId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dag_modules_hidden_module\` (\`dAGId\` varchar(36) NOT NULL, \`moduleId\` varchar(36) NOT NULL, INDEX \`IDX_35c5c4280161e424db957793de\` (\`dAGId\`), INDEX \`IDX_895b5f150255b9fb18d992a479\` (\`moduleId\`), PRIMARY KEY (\`dAGId\`, \`moduleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`module\` CHANGE \`description\` \`description\` longblob NULL`);
        await queryRunner.query(`ALTER TABLE \`DAG\` ADD CONSTRAINT \`FK_95dbfc73ce5055ca2b136f5c9c3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DAG\` ADD CONSTRAINT \`FK_bf1c2e3f57314b27dc5d5ac790c\` FOREIGN KEY (\`degreeId\`) REFERENCES \`degree\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_modules_done_module\` ADD CONSTRAINT \`FK_6e9ccdc3f581b4d4ef99d82f379\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_modules_done_module\` ADD CONSTRAINT \`FK_d41a87d35a5c1008452c44bea31\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` ADD CONSTRAINT \`FK_4b333af5e5071937f7eba70c5d0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` ADD CONSTRAINT \`FK_a0ac2a1563d827af2e4ccf24420\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`degree_modules_module\` ADD CONSTRAINT \`FK_a732fecaebb04f713be62f7afdd\` FOREIGN KEY (\`degreeId\`) REFERENCES \`degree\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`degree_modules_module\` ADD CONSTRAINT \`FK_670cd15a366ceb0e0834f507ee3\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`dag_modules_placed_module\` ADD CONSTRAINT \`FK_0ca97d3434421eaf55b79847cee\` FOREIGN KEY (\`dAGId\`) REFERENCES \`DAG\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`dag_modules_placed_module\` ADD CONSTRAINT \`FK_67d9d483ba4bf496707d9854c0f\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`dag_modules_hidden_module\` ADD CONSTRAINT \`FK_35c5c4280161e424db957793de0\` FOREIGN KEY (\`dAGId\`) REFERENCES \`DAG\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`dag_modules_hidden_module\` ADD CONSTRAINT \`FK_895b5f150255b9fb18d992a4799\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dag_modules_hidden_module\` DROP FOREIGN KEY \`FK_895b5f150255b9fb18d992a4799\``);
        await queryRunner.query(`ALTER TABLE \`dag_modules_hidden_module\` DROP FOREIGN KEY \`FK_35c5c4280161e424db957793de0\``);
        await queryRunner.query(`ALTER TABLE \`dag_modules_placed_module\` DROP FOREIGN KEY \`FK_67d9d483ba4bf496707d9854c0f\``);
        await queryRunner.query(`ALTER TABLE \`dag_modules_placed_module\` DROP FOREIGN KEY \`FK_0ca97d3434421eaf55b79847cee\``);
        await queryRunner.query(`ALTER TABLE \`degree_modules_module\` DROP FOREIGN KEY \`FK_670cd15a366ceb0e0834f507ee3\``);
        await queryRunner.query(`ALTER TABLE \`degree_modules_module\` DROP FOREIGN KEY \`FK_a732fecaebb04f713be62f7afdd\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` DROP FOREIGN KEY \`FK_a0ac2a1563d827af2e4ccf24420\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_doing_module\` DROP FOREIGN KEY \`FK_4b333af5e5071937f7eba70c5d0\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_done_module\` DROP FOREIGN KEY \`FK_d41a87d35a5c1008452c44bea31\``);
        await queryRunner.query(`ALTER TABLE \`user_modules_done_module\` DROP FOREIGN KEY \`FK_6e9ccdc3f581b4d4ef99d82f379\``);
        await queryRunner.query(`ALTER TABLE \`DAG\` DROP FOREIGN KEY \`FK_bf1c2e3f57314b27dc5d5ac790c\``);
        await queryRunner.query(`ALTER TABLE \`DAG\` DROP FOREIGN KEY \`FK_95dbfc73ce5055ca2b136f5c9c3\``);
        await queryRunner.query(`ALTER TABLE \`module\` CHANGE \`description\` \`description\` longblob NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_895b5f150255b9fb18d992a479\` ON \`dag_modules_hidden_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_35c5c4280161e424db957793de\` ON \`dag_modules_hidden_module\``);
        await queryRunner.query(`DROP TABLE \`dag_modules_hidden_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_67d9d483ba4bf496707d9854c0\` ON \`dag_modules_placed_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_0ca97d3434421eaf55b79847ce\` ON \`dag_modules_placed_module\``);
        await queryRunner.query(`DROP TABLE \`dag_modules_placed_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_670cd15a366ceb0e0834f507ee\` ON \`degree_modules_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_a732fecaebb04f713be62f7afd\` ON \`degree_modules_module\``);
        await queryRunner.query(`DROP TABLE \`degree_modules_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0ac2a1563d827af2e4ccf2442\` ON \`user_modules_doing_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_4b333af5e5071937f7eba70c5d\` ON \`user_modules_doing_module\``);
        await queryRunner.query(`DROP TABLE \`user_modules_doing_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_d41a87d35a5c1008452c44bea3\` ON \`user_modules_done_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_6e9ccdc3f581b4d4ef99d82f37\` ON \`user_modules_done_module\``);
        await queryRunner.query(`DROP TABLE \`user_modules_done_module\``);
        await queryRunner.query(`DROP TABLE \`DAG\``);
        await queryRunner.query(`DROP TABLE \`degree\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
