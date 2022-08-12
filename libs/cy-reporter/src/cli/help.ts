export const helpText = `
modtree Cypress runner

USAGE: yarn cy [COMMMAND] [OPTIONS]

COMMAND:
      r, run        run one or all cypress tests
                    (use --all to run all tests, use without args
                    to have fzf prompt you for which test to run)
      ra, run-all   run all cypress tests
      ls, list      list cypress runs related to current commit
      o, open       open the cypress graphical user interface

OPTIONS
      -a, --all     run all tests (ls --all is not supported)
      -f, --force   run tests without checking for a clean git status
`
