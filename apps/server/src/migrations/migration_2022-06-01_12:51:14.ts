import { MigrationInterface, QueryRunner } from 'typeorm'

export class migration1654059076669 implements MigrationInterface {
  name = 'migration1654059076669'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `degree` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `user` (`id` varchar(36) NOT NULL, `displayName` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `matriculationYear` int NOT NULL, `graduationYear` int NOT NULL, `graduationSemester` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `Graph` (`id` varchar(36) NOT NULL, `userId` varchar(36) NULL, `degreeId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `degree_modules_module` (`degreeId` varchar(36) NOT NULL, `moduleId` varchar(36) NOT NULL, INDEX `IDX_a732fecaebb04f713be62f7afd` (`degreeId`), INDEX `IDX_670cd15a366ceb0e0834f507ee` (`moduleId`), PRIMARY KEY (`degreeId`, `moduleId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `user_modules_done_module` (`userId` varchar(36) NOT NULL, `moduleId` varchar(36) NOT NULL, INDEX `IDX_6e9ccdc3f581b4d4ef99d82f37` (`userId`), INDEX `IDX_d41a87d35a5c1008452c44bea3` (`moduleId`), PRIMARY KEY (`userId`, `moduleId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `user_modules_doing_module` (`userId` varchar(36) NOT NULL, `moduleId` varchar(36) NOT NULL, INDEX `IDX_4b333af5e5071937f7eba70c5d` (`userId`), INDEX `IDX_a0ac2a1563d827af2e4ccf2442` (`moduleId`), PRIMARY KEY (`userId`, `moduleId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `user_saved_degrees_degree` (`userId` varchar(36) NOT NULL, `degreeId` varchar(36) NOT NULL, INDEX `IDX_91e37244f0527c73cc12851262` (`userId`), INDEX `IDX_cf0eb0d66da9f2076f42d15fcc` (`degreeId`), PRIMARY KEY (`userId`, `degreeId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `graph_modules_placed_module` (`graphId` varchar(36) NOT NULL, `moduleId` varchar(36) NOT NULL, INDEX `IDX_edecdc3106863b709e515178b3` (`graphId`), INDEX `IDX_0dfbed7589128fdb16b5c10e6a` (`moduleId`), PRIMARY KEY (`graphId`, `moduleId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `graph_modules_hidden_module` (`graphId` varchar(36) NOT NULL, `moduleId` varchar(36) NOT NULL, INDEX `IDX_6af0127c032fc21654a4277826` (`graphId`), INDEX `IDX_142b842f7dcbc4eb38a796fbd9` (`moduleId`), PRIMARY KEY (`graphId`, `moduleId`)) ENGINE=InnoDB'
    )
    await queryRunner.query('ALTER TABLE `module` DROP COLUMN `description`')
    await queryRunner.query(
      'ALTER TABLE `module` ADD `description` varchar(255) NULL'
    )
    await queryRunner.query(
      'ALTER TABLE `Graph` ADD CONSTRAINT `FK_f0a9bf89839678324c47bd136f1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE `Graph` ADD CONSTRAINT `FK_c9aa8395a6af29b14701649d862` FOREIGN KEY (`degreeId`) REFERENCES `degree`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE `degree_modules_module` ADD CONSTRAINT `FK_a732fecaebb04f713be62f7afdd` FOREIGN KEY (`degreeId`) REFERENCES `degree`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `degree_modules_module` ADD CONSTRAINT `FK_670cd15a366ceb0e0834f507ee3` FOREIGN KEY (`moduleId`) REFERENCES `module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_done_module` ADD CONSTRAINT `FK_6e9ccdc3f581b4d4ef99d82f379` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_done_module` ADD CONSTRAINT `FK_d41a87d35a5c1008452c44bea31` FOREIGN KEY (`moduleId`) REFERENCES `module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_doing_module` ADD CONSTRAINT `FK_4b333af5e5071937f7eba70c5d0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_doing_module` ADD CONSTRAINT `FK_a0ac2a1563d827af2e4ccf24420` FOREIGN KEY (`moduleId`) REFERENCES `module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `user_saved_degrees_degree` ADD CONSTRAINT `FK_91e37244f0527c73cc128512626` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `user_saved_degrees_degree` ADD CONSTRAINT `FK_cf0eb0d66da9f2076f42d15fcc5` FOREIGN KEY (`degreeId`) REFERENCES `degree`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_placed_module` ADD CONSTRAINT `FK_edecdc3106863b709e515178b39` FOREIGN KEY (`graphId`) REFERENCES `Graph`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_placed_module` ADD CONSTRAINT `FK_0dfbed7589128fdb16b5c10e6ab` FOREIGN KEY (`moduleId`) REFERENCES `module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_hidden_module` ADD CONSTRAINT `FK_6af0127c032fc21654a4277826e` FOREIGN KEY (`graphId`) REFERENCES `Graph`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_hidden_module` ADD CONSTRAINT `FK_142b842f7dcbc4eb38a796fbd96` FOREIGN KEY (`moduleId`) REFERENCES `module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `graph_modules_hidden_module` DROP FOREIGN KEY `FK_142b842f7dcbc4eb38a796fbd96`'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_hidden_module` DROP FOREIGN KEY `FK_6af0127c032fc21654a4277826e`'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_placed_module` DROP FOREIGN KEY `FK_0dfbed7589128fdb16b5c10e6ab`'
    )
    await queryRunner.query(
      'ALTER TABLE `graph_modules_placed_module` DROP FOREIGN KEY `FK_edecdc3106863b709e515178b39`'
    )
    await queryRunner.query(
      'ALTER TABLE `user_saved_degrees_degree` DROP FOREIGN KEY `FK_cf0eb0d66da9f2076f42d15fcc5`'
    )
    await queryRunner.query(
      'ALTER TABLE `user_saved_degrees_degree` DROP FOREIGN KEY `FK_91e37244f0527c73cc128512626`'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_doing_module` DROP FOREIGN KEY `FK_a0ac2a1563d827af2e4ccf24420`'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_doing_module` DROP FOREIGN KEY `FK_4b333af5e5071937f7eba70c5d0`'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_done_module` DROP FOREIGN KEY `FK_d41a87d35a5c1008452c44bea31`'
    )
    await queryRunner.query(
      'ALTER TABLE `user_modules_done_module` DROP FOREIGN KEY `FK_6e9ccdc3f581b4d4ef99d82f379`'
    )
    await queryRunner.query(
      'ALTER TABLE `degree_modules_module` DROP FOREIGN KEY `FK_670cd15a366ceb0e0834f507ee3`'
    )
    await queryRunner.query(
      'ALTER TABLE `degree_modules_module` DROP FOREIGN KEY `FK_a732fecaebb04f713be62f7afdd`'
    )
    await queryRunner.query(
      'ALTER TABLE `Graph` DROP FOREIGN KEY `FK_c9aa8395a6af29b14701649d862`'
    )
    await queryRunner.query(
      'ALTER TABLE `Graph` DROP FOREIGN KEY `FK_f0a9bf89839678324c47bd136f1`'
    )
    await queryRunner.query('ALTER TABLE `module` DROP COLUMN `description`')
    await queryRunner.query(
      'ALTER TABLE `module` ADD `description` longblob NOT NULL'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_142b842f7dcbc4eb38a796fbd9` ON `graph_modules_hidden_module`'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_6af0127c032fc21654a4277826` ON `graph_modules_hidden_module`'
    )
    await queryRunner.query('DROP TABLE `graph_modules_hidden_module`')
    await queryRunner.query(
      'DROP INDEX `IDX_0dfbed7589128fdb16b5c10e6a` ON `graph_modules_placed_module`'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_edecdc3106863b709e515178b3` ON `graph_modules_placed_module`'
    )
    await queryRunner.query('DROP TABLE `graph_modules_placed_module`')
    await queryRunner.query(
      'DROP INDEX `IDX_cf0eb0d66da9f2076f42d15fcc` ON `user_saved_degrees_degree`'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_91e37244f0527c73cc12851262` ON `user_saved_degrees_degree`'
    )
    await queryRunner.query('DROP TABLE `user_saved_degrees_degree`')
    await queryRunner.query(
      'DROP INDEX `IDX_a0ac2a1563d827af2e4ccf2442` ON `user_modules_doing_module`'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_4b333af5e5071937f7eba70c5d` ON `user_modules_doing_module`'
    )
    await queryRunner.query('DROP TABLE `user_modules_doing_module`')
    await queryRunner.query(
      'DROP INDEX `IDX_d41a87d35a5c1008452c44bea3` ON `user_modules_done_module`'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_6e9ccdc3f581b4d4ef99d82f37` ON `user_modules_done_module`'
    )
    await queryRunner.query('DROP TABLE `user_modules_done_module`')
    await queryRunner.query(
      'DROP INDEX `IDX_670cd15a366ceb0e0834f507ee` ON `degree_modules_module`'
    )
    await queryRunner.query(
      'DROP INDEX `IDX_a732fecaebb04f713be62f7afd` ON `degree_modules_module`'
    )
    await queryRunner.query('DROP TABLE `degree_modules_module`')
    await queryRunner.query('DROP TABLE `Graph`')
    await queryRunner.query('DROP TABLE `user`')
    await queryRunner.query('DROP TABLE `degree`')
  }
}
