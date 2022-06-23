<h1 align="center">
  <img src="https://raw.githubusercontent.com/wiki/modtree/modtree/logo/banner-light-bg.png" alt="modtree">
</h1>

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

After cloning, run `yarn setup` from the root of the workspace.

```
git clone git@github.com:modtree/modtree.git
cd modtree && yarn setup
```
