<h1 align="center">
  <img src="https://raw.githubusercontent.com/wiki/modtree/modtree/logo/banner-light-bg.svg" alt="modtree" style="width:320px">
</h1>

[![GitHub CI](https://github.com/modtree/modtree/workflows/ci/badge.svg)](https://github.com/modtree/modtree/actions/workflows/ci.yml)
[![codecov](https://img.shields.io/codecov/c/github/modtree/modtree.svg)](https://codecov.io/gh/modtree/modtree)
![code size](https://img.shields.io/github/languages/code-size/modtree/modtree)
![lines of code](https://img.shields.io/tokei/lines/github/modtree/modtree)
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
├── .github/workflows   automated testing
├── apps                front-end apps
│  ├── docs             documentation website source
│  └── web              main website source
└── packages            project-wide shared resources
   ├── database         backend functions
   ├── entity           SQL entities
   └── types            all TypeScript types
```

## Setup

After cloning, run `pnpm setup` from the root of the workspace.

```
git clone git@github.com:modtree/modtree.git
cd modtree && pnpm setup
```
