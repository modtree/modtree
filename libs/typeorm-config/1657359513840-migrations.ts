import { MigrationInterface, QueryRunner } from 'typeorm'

export class migrations1657359513840 implements MigrationInterface {
  name = 'migrations1657359513840'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "degree" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, CONSTRAINT "PK_98a6bfd72670bddb790a13cbca1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authZeroId" text NOT NULL DEFAULT '', "displayName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "matriculationYear" integer NOT NULL, "graduationYear" integer NOT NULL, "graduationSemester" integer NOT NULL, "mainDegreeId" uuid, "mainGraphId" uuid, CONSTRAINT "PK_c41e0dcaba3a7db141aa2660aa4" PRIMARY KEY ("id", "authZeroId"))`
    )
    await queryRunner.query(
      `CREATE TABLE "graph" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL DEFAULT 'graph', "flowNodes" json NOT NULL DEFAULT '[]', "flowEdges" json NOT NULL DEFAULT '[]', "userId" uuid, "userAuthZeroId" text, "degreeId" uuid, CONSTRAINT "PK_eb3e36eefae596e0ba9122fff16" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "degree_modules_module" ("degreeId" uuid NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "PK_22a8c4ff1560382d96cfe601448" PRIMARY KEY ("degreeId", "moduleId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a732fecaebb04f713be62f7afd" ON "degree_modules_module" ("degreeId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_670cd15a366ceb0e0834f507ee" ON "degree_modules_module" ("moduleId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_modules_done_module" ("userId" uuid NOT NULL, "userAuthZeroId" text NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "PK_5f6dbd1820973ea0f8495a7f14a" PRIMARY KEY ("userId", "userAuthZeroId", "moduleId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bb06f206e32f68cff42ec226e3" ON "user_modules_done_module" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d41a87d35a5c1008452c44bea3" ON "user_modules_done_module" ("moduleId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_modules_doing_module" ("userId" uuid NOT NULL, "userAuthZeroId" text NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "PK_824fb06afb3af4971ae134b4c73" PRIMARY KEY ("userId", "userAuthZeroId", "moduleId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_265f0667f5e887a91a39282eef" ON "user_modules_doing_module" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a0ac2a1563d827af2e4ccf2442" ON "user_modules_doing_module" ("moduleId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_saved_degrees_degree" ("userId" uuid NOT NULL, "userAuthZeroId" text NOT NULL, "degreeId" uuid NOT NULL, CONSTRAINT "PK_2e25edc2dc076b38377a9543962" PRIMARY KEY ("userId", "userAuthZeroId", "degreeId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2a9a08991a0fc6a4ad808a065b" ON "user_saved_degrees_degree" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cf0eb0d66da9f2076f42d15fcc" ON "user_saved_degrees_degree" ("degreeId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_saved_graphs_graph" ("userId" uuid NOT NULL, "userAuthZeroId" text NOT NULL, "graphId" uuid NOT NULL, CONSTRAINT "PK_adab1532634d5801c4cf494ae7a" PRIMARY KEY ("userId", "userAuthZeroId", "graphId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_82561283f2ed6d25c4c00f1818" ON "user_saved_graphs_graph" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_41455bad19c776a396f31495c5" ON "user_saved_graphs_graph" ("graphId") `
    )
    await queryRunner.query(
      `CREATE TABLE "graph_modules_placed_module" ("graphId" uuid NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "PK_1c9675e5428f95e4d95e490ba22" PRIMARY KEY ("graphId", "moduleId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_edecdc3106863b709e515178b3" ON "graph_modules_placed_module" ("graphId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0dfbed7589128fdb16b5c10e6a" ON "graph_modules_placed_module" ("moduleId") `
    )
    await queryRunner.query(
      `CREATE TABLE "graph_modules_hidden_module" ("graphId" uuid NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "PK_90a9d193ffbf7112eba04d93869" PRIMARY KEY ("graphId", "moduleId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6af0127c032fc21654a4277826" ON "graph_modules_hidden_module" ("graphId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_142b842f7dcbc4eb38a796fbd9" ON "graph_modules_hidden_module" ("moduleId") `
    )
    await queryRunner.query(
      `ALTER TABLE "module" ADD "newProp2" text NOT NULL DEFAULT 'meme'`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_12c3b3fab981ff84049eccdecb1" FOREIGN KEY ("mainDegreeId") REFERENCES "degree"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_6b37deb8ab14597291a9c8959b8" FOREIGN KEY ("mainGraphId") REFERENCES "graph"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "graph" ADD CONSTRAINT "FK_8e7ed5eec5156734e78ab177c1e" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "graph" ADD CONSTRAINT "FK_4da77725f6c033616bd39012735" FOREIGN KEY ("degreeId") REFERENCES "degree"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "degree_modules_module" ADD CONSTRAINT "FK_a732fecaebb04f713be62f7afdd" FOREIGN KEY ("degreeId") REFERENCES "degree"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "degree_modules_module" ADD CONSTRAINT "FK_670cd15a366ceb0e0834f507ee3" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD CONSTRAINT "FK_bb06f206e32f68cff42ec226e37" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD CONSTRAINT "FK_d41a87d35a5c1008452c44bea31" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD CONSTRAINT "FK_265f0667f5e887a91a39282eef0" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD CONSTRAINT "FK_a0ac2a1563d827af2e4ccf24420" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD CONSTRAINT "FK_2a9a08991a0fc6a4ad808a065bd" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD CONSTRAINT "FK_cf0eb0d66da9f2076f42d15fcc5" FOREIGN KEY ("degreeId") REFERENCES "degree"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD CONSTRAINT "FK_82561283f2ed6d25c4c00f18188" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD CONSTRAINT "FK_41455bad19c776a396f31495c57" FOREIGN KEY ("graphId") REFERENCES "graph"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_placed_module" ADD CONSTRAINT "FK_edecdc3106863b709e515178b39" FOREIGN KEY ("graphId") REFERENCES "graph"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_placed_module" ADD CONSTRAINT "FK_0dfbed7589128fdb16b5c10e6ab" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_hidden_module" ADD CONSTRAINT "FK_6af0127c032fc21654a4277826e" FOREIGN KEY ("graphId") REFERENCES "graph"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_hidden_module" ADD CONSTRAINT "FK_142b842f7dcbc4eb38a796fbd96" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "graph_modules_hidden_module" DROP CONSTRAINT "FK_142b842f7dcbc4eb38a796fbd96"`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_hidden_module" DROP CONSTRAINT "FK_6af0127c032fc21654a4277826e"`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_placed_module" DROP CONSTRAINT "FK_0dfbed7589128fdb16b5c10e6ab"`
    )
    await queryRunner.query(
      `ALTER TABLE "graph_modules_placed_module" DROP CONSTRAINT "FK_edecdc3106863b709e515178b39"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP CONSTRAINT "FK_41455bad19c776a396f31495c57"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP CONSTRAINT "FK_82561283f2ed6d25c4c00f18188"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP CONSTRAINT "FK_cf0eb0d66da9f2076f42d15fcc5"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP CONSTRAINT "FK_2a9a08991a0fc6a4ad808a065bd"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP CONSTRAINT "FK_a0ac2a1563d827af2e4ccf24420"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP CONSTRAINT "FK_265f0667f5e887a91a39282eef0"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP CONSTRAINT "FK_d41a87d35a5c1008452c44bea31"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP CONSTRAINT "FK_bb06f206e32f68cff42ec226e37"`
    )
    await queryRunner.query(
      `ALTER TABLE "degree_modules_module" DROP CONSTRAINT "FK_670cd15a366ceb0e0834f507ee3"`
    )
    await queryRunner.query(
      `ALTER TABLE "degree_modules_module" DROP CONSTRAINT "FK_a732fecaebb04f713be62f7afdd"`
    )
    await queryRunner.query(
      `ALTER TABLE "graph" DROP CONSTRAINT "FK_4da77725f6c033616bd39012735"`
    )
    await queryRunner.query(
      `ALTER TABLE "graph" DROP CONSTRAINT "FK_8e7ed5eec5156734e78ab177c1e"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_6b37deb8ab14597291a9c8959b8"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_12c3b3fab981ff84049eccdecb1"`
    )
    await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "newProp2"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_142b842f7dcbc4eb38a796fbd9"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6af0127c032fc21654a4277826"`
    )
    await queryRunner.query(`DROP TABLE "graph_modules_hidden_module"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dfbed7589128fdb16b5c10e6a"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_edecdc3106863b709e515178b3"`
    )
    await queryRunner.query(`DROP TABLE "graph_modules_placed_module"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41455bad19c776a396f31495c5"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82561283f2ed6d25c4c00f1818"`
    )
    await queryRunner.query(`DROP TABLE "user_saved_graphs_graph"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf0eb0d66da9f2076f42d15fcc"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a9a08991a0fc6a4ad808a065b"`
    )
    await queryRunner.query(`DROP TABLE "user_saved_degrees_degree"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0ac2a1563d827af2e4ccf2442"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_265f0667f5e887a91a39282eef"`
    )
    await queryRunner.query(`DROP TABLE "user_modules_doing_module"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d41a87d35a5c1008452c44bea3"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb06f206e32f68cff42ec226e3"`
    )
    await queryRunner.query(`DROP TABLE "user_modules_done_module"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_670cd15a366ceb0e0834f507ee"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a732fecaebb04f713be62f7afd"`
    )
    await queryRunner.query(`DROP TABLE "degree_modules_module"`)
    await queryRunner.query(`DROP TABLE "graph"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "degree"`)
  }
}
