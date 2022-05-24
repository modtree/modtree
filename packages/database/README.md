# database README

# Database Functions

modtree’s database functions are written in TypeScript, with MySQL as a database, and so we use [TypeORM](https://typeorm.io).

## Directory Layout

```
.
├── .sql           SQL snapshots
├── src
│  ├── api         Debug functions to run with yarn scripts
│  ├── controller  Server API endpoints
│  ├── entity      TypeORM entities (User, Degree, Module, ...)
│  ├── repository  TypeORM repositories, one for each entity
│  ├── sql         SQL functions
│  └── utils       All the node.js functions we don't want to write twice
├── tests          Unit tests
└── types          Types
```

# Requirements

- `mysql`
- `yarn v1`

# Setup

```bash
yarn
# Replace 
cp .env.example .env
cp .env.example .env.test
```

This is how `.env.example` looks like. Fill in `MYSQL_USERNAME` and `MYSQL_PASSWORD` with your MySQL username and password.

```bash
DATABASE_TYPE=mysql
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_HOST=localhost
MYSQL_ACTIVE_DATABASE=mysql_modtree
MYSQL_RESTORE_SOURCE=.test.sql
MYSQL_SERVER_CA=
MYSQL_CLIENT_CERT=
MYSQL_CLIENT_KEY=
```

# Testing

We use `yarn test:ci` for unit testing.
