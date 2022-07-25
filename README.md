<h1 align="center">
  <img src="https://raw.githubusercontent.com/wiki/modtree/modtree/logo/banner-light-bg.svg" alt="modtree" style="width:320px">
</h1>

[![GitHub CI](https://github.com/modtree/modtree/workflows/ci/badge.svg)](https://github.com/modtree/modtree/actions/workflows/ci.yml)
[![codecov](https://img.shields.io/codecov/c/github/modtree/modtree.svg)](https://codecov.io/gh/modtree/modtree)
![code size](https://img.shields.io/github/languages/code-size/modtree/modtree)
![version](https://img.shields.io/github/package-json/v/modtree/modtree)

Modtree is a project that seeks to leverage [existing
data](https://api.nusmods.com/v2/) in a graph-oriented visualization
tool in order to:

- Increase clarity in degree planning
- Allow students to efficiently experiment with different degree paths
- Minimize mental overhead and time spent to source for degree data
- Improve module information accessibility

## Project Layout

```
├── .github/workflows     automated testing/deployments
│
├── apps                  user-facing apps
│  ├── web                website (frontend)
│  ├── server             API server (backend)
│  └── docs               documentation website
│
├── libs                  shared resources
│  ├── types              types, interfaces, and TypeORM entities
│  ├── repos              backend functions (TypeORM Repositories)
│  ├── utils              shared utilities
│  ├── typeorm-config     TypeORM database connection configuration
│  ├── test-env           common test setups (mostly Jest)
│  ├── integration-tests  tests that require a running database
│  ├── migrations         schema migration checker, generator, and runner
│  └── sql                SQL commands piped through TypeScript
│
├── scripts               helper scripts
├── docker                dockerfiles and scripts
└── references            JSON exports of database views
```

## Setup

After cloning, run `yarn setup` from the root of the workspace.

```
git clone git@github.com:modtree/modtree.git
cd modtree && yarn setup
```
