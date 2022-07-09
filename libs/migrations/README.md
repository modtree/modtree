# Migrations

For when schema changes.

## Step 0: Test connection

This checks to see if there's any issues with running the most basic
ORM method: `find()`.

```bash
yarn tc # test connection
```

## Step 1: Generate the migration file

This creates a TypeScript file that contains TypeORM SQL queries that
upon running, executes a migration.

```bash
yarn mg --name graph_title # migration: generate
yarn mg --name graph_title --dr # to do a dry-run (doesn't create any files)
```

## Step 2 (last step): Run the migration file

This executes the migration.

This step is purposefully left as manual because it requires careful
attention each time, and each time might be slightly different.

Edit `libs/migrations/snapshots/index.ts` to import and
re-export the new migration `.ts` file generated.

This will inherently modify the `migrations` array imported by
`libs/migrations/src/config.ts`, which the next command
will read.

```bash
yarn mr # migration: generate
```

And you're done.
