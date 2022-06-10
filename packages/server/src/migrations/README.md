# TypeORM Migrations

## How to create a migration

1. Navigate to `src/data-source.ts`, and set `synchronize` to `false` in the config for the exported `DataSource` in this file.
2. Ensure that the database (name stored in `.env`) corresponds to the latest state in the migrations. Using `yarn restore` on `.test.sql` should work for this step.
3. Run `yarn mc` to preview the migration output.
4. Edit the intended migration name in `package.json` script `mg`.
5. Run `yarn mg` to generate the migration file. At this point, no changes have been made to your database yet, so if a mistake is made, simply `rm` the migration file.
6. Run `yarn mr` to run the migration. (This step is required because auto-migration is off by default). Your database should be updated.
7. Run `yarn dump` to create a `.sql` seed file to represent the migrated state, and update `.sql/README.yml`.
