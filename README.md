# modtree

This is modtree's [turbocharged](https://turborepo.org) monorepo.

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps

- `docs`: a [Next.js](https://nextjs.org) app
- `web`: another [Next.js](https://nextjs.org) app

### Packages

- `database`: a library of database functions
- `config`: linting and formattings configurations
- `tsconfig`: typescript configs used throughout the monorepo

## Setup

After cloning, run `yarn setup` from the root of the workspace.

```
git clone git@github.com:modtree/modtree.git
cd modtree && yarn setup
```
