import { MigrationInterface, QueryRunner } from 'typeorm'

export class googleId1658194885583 implements MigrationInterface {
  name = 'googleId1658194885583'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "graph" DROP CONSTRAINT "FK_8e7ed5eec5156734e78ab177c1e"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP CONSTRAINT "FK_bb06f206e32f68cff42ec226e37"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP CONSTRAINT "FK_265f0667f5e887a91a39282eef0"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP CONSTRAINT "FK_2a9a08991a0fc6a4ad808a065bd"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP CONSTRAINT "FK_82561283f2ed6d25c4c00f18188"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb06f206e32f68cff42ec226e3"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_265f0667f5e887a91a39282eef"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a9a08991a0fc6a4ad808a065b"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82561283f2ed6d25c4c00f1818"`
    )
    await queryRunner.query(`ALTER TABLE "graph" DROP COLUMN "userAuthZeroId"`)
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP CONSTRAINT "PK_5f6dbd1820973ea0f8495a7f14a"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD CONSTRAINT "PK_a4c74b203c79b7e78545536fa4a" PRIMARY KEY ("userId", "moduleId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP COLUMN "userAuthZeroId"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP CONSTRAINT "PK_824fb06afb3af4971ae134b4c73"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD CONSTRAINT "PK_4a65d01a2b28bb2aca4ef10f75f" PRIMARY KEY ("userId", "moduleId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP COLUMN "userAuthZeroId"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP CONSTRAINT "PK_2e25edc2dc076b38377a9543962"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD CONSTRAINT "PK_e7a3a3595f98254ba1d31236369" PRIMARY KEY ("userId", "degreeId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP COLUMN "userAuthZeroId"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP CONSTRAINT "PK_adab1532634d5801c4cf494ae7a"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD CONSTRAINT "PK_27160bf381d09cbad311d1b461d" PRIMARY KEY ("userId", "graphId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP COLUMN "userAuthZeroId"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "googleId" character varying NOT NULL DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_c41e0dcaba3a7db141aa2660aa4"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authZeroId"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "authZeroId" character varying NOT NULL DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "displayName" SET DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "matriculationYear" SET DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "graduationYear" SET DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "graduationSemester" SET DEFAULT '0'`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6e9ccdc3f581b4d4ef99d82f37" ON "user_modules_done_module" ("userId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4b333af5e5071937f7eba70c5d" ON "user_modules_doing_module" ("userId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_91e37244f0527c73cc12851262" ON "user_saved_degrees_degree" ("userId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b6f32f3522dbf23d8d53b50262" ON "user_saved_graphs_graph" ("userId") `
    )
    await queryRunner.query(
      `ALTER TABLE "graph" ADD CONSTRAINT "FK_dfa84ab0da4d21caf75c82862bd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD CONSTRAINT "FK_6e9ccdc3f581b4d4ef99d82f379" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD CONSTRAINT "FK_4b333af5e5071937f7eba70c5d0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD CONSTRAINT "FK_91e37244f0527c73cc128512626" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD CONSTRAINT "FK_b6f32f3522dbf23d8d53b502628" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP CONSTRAINT "FK_b6f32f3522dbf23d8d53b502628"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP CONSTRAINT "FK_91e37244f0527c73cc128512626"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP CONSTRAINT "FK_4b333af5e5071937f7eba70c5d0"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP CONSTRAINT "FK_6e9ccdc3f581b4d4ef99d82f379"`
    )
    await queryRunner.query(
      `ALTER TABLE "graph" DROP CONSTRAINT "FK_dfa84ab0da4d21caf75c82862bd"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b6f32f3522dbf23d8d53b50262"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91e37244f0527c73cc12851262"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b333af5e5071937f7eba70c5d"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6e9ccdc3f581b4d4ef99d82f37"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "graduationSemester" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "graduationYear" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "matriculationYear" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "displayName" DROP DEFAULT`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authZeroId"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "authZeroId" text NOT NULL DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_c41e0dcaba3a7db141aa2660aa4" PRIMARY KEY ("id", "authZeroId")`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`)
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD "userAuthZeroId" text NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" DROP CONSTRAINT "PK_27160bf381d09cbad311d1b461d"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD CONSTRAINT "PK_adab1532634d5801c4cf494ae7a" PRIMARY KEY ("userId", "graphId", "userAuthZeroId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD "userAuthZeroId" text NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" DROP CONSTRAINT "PK_e7a3a3595f98254ba1d31236369"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD CONSTRAINT "PK_2e25edc2dc076b38377a9543962" PRIMARY KEY ("userId", "degreeId", "userAuthZeroId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD "userAuthZeroId" text NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" DROP CONSTRAINT "PK_4a65d01a2b28bb2aca4ef10f75f"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD CONSTRAINT "PK_824fb06afb3af4971ae134b4c73" PRIMARY KEY ("userId", "moduleId", "userAuthZeroId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD "userAuthZeroId" text NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" DROP CONSTRAINT "PK_a4c74b203c79b7e78545536fa4a"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD CONSTRAINT "PK_5f6dbd1820973ea0f8495a7f14a" PRIMARY KEY ("userId", "moduleId", "userAuthZeroId")`
    )
    await queryRunner.query(`ALTER TABLE "graph" ADD "userAuthZeroId" text`)
    await queryRunner.query(
      `CREATE INDEX "IDX_82561283f2ed6d25c4c00f1818" ON "user_saved_graphs_graph" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2a9a08991a0fc6a4ad808a065b" ON "user_saved_degrees_degree" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_265f0667f5e887a91a39282eef" ON "user_modules_doing_module" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bb06f206e32f68cff42ec226e3" ON "user_modules_done_module" ("userId", "userAuthZeroId") `
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_graphs_graph" ADD CONSTRAINT "FK_82561283f2ed6d25c4c00f18188" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_saved_degrees_degree" ADD CONSTRAINT "FK_2a9a08991a0fc6a4ad808a065bd" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_doing_module" ADD CONSTRAINT "FK_265f0667f5e887a91a39282eef0" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_modules_done_module" ADD CONSTRAINT "FK_bb06f206e32f68cff42ec226e37" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "graph" ADD CONSTRAINT "FK_8e7ed5eec5156734e78ab177c1e" FOREIGN KEY ("userId", "userAuthZeroId") REFERENCES "user"("id","authZeroId") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
