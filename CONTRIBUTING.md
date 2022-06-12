# Contributing to Modtree

## Getting started

If you want to help but don't know where to start, here are some
low-risk/isolated tasks:

- Try a [complexity:low] issue.
- Improve documentation.

## Reporting problems

- [Check the FAQ][modtree-faq].
- [Search existing issues][github-issues] (including closed!)
- Update Modtree to the latest version to see if your problem
  persists.
- [Bisect][git-bisect] Modtree's source code to find the cause of a
  regression, if you can. This is _extremely_ helpful.
- Include any system/terminal logs.

## Pull requests (PRs)

- To avoid duplicate work, create a draft pull request.
- Your PR must include instructions on how to test the changes you
  made. Ideally, write a test for it.
- Avoid cosmetic changes to unrelated files in the same commit.
- Use a [feature branch] instead of the master branch.
- Use a **rebase workflow** for small PRs.
  - After addressing review comments, it's fine to rebase and force-push.
- Use a **merge workflow** for big, high-risk PRs.
  - Merge `master` into your PR when there are conflicts or when master
    introduces breaking changes.
  - Do not edit commits that come before the merge commit.

### Stages: Draft and Ready for review

Pull requests have two stages: Draft and Ready for review.

1. [Create a Draft PR][pr-draft] while you are _not_ requesting feedback as
   you are still working on the PR.
   - You can skip this if your PR is ready for review.
2. [Change your PR to ready][pr-ready] when the PR is ready for review.
   - You can convert back to Draft at any time.

Do **not** add labels like `[RFC]` or `[WIP]` in the title to indicate the
state of your PR: this just adds noise. Non-Draft PRs are assumed to be open
for comments; if you want feedback from specific people, `@`-mention them in
a comment.

### Commit messages

Follow the [conventional commits guidelines] to _make reviews easier_ and to make
the VCS/git logs more valuable. The general structure of a commit message is:

```
<type>([optional scope]): <description>

[optional body]

[optional footer(s)]
```

- Prefix the commit subject with one of these [_types_][commit-types]:
  - `build`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `test`
  - You can **ignore this for "fixup" commits** or any commits you expect to be squashed.
- Append optional scope to _type_ such as `(postgres)`, `(sql)`, `(flow)`, ...
- _Description_ shouldn't start with a capital letter or end in a period.
- Use the _imperative voice_: "Fix bug" rather than "Fixed bug" or "Fixes bug."
- Try to keep the first line under 72 characters.
- A blank line must follow the subject.
- Breaking API changes must be indicated by

  1. "!" after the type/scope, and
  2. a "BREAKING CHANGE" footer describing the change.
     Example:

     ```
     refactor(provider)!: drop support for Python 2

     BREAKING CHANGE: refactor to use Python 3 features since Python 2 is no longer supported.
     ```

### Automated builds (CI)

Each pull request must pass the automated builds on [GitHub Actions].

- See [the tests page][modtree-tests] to run tests locally.
  Passing locally doesn't guarantee passing the CI build.

## Coding

### Lint

You can run the linter locally by:

```
yarn lint
```

### Style

- Style rules are (mostly) defined by `packages/config/prettier.js`.
  As long as you're within the project, your [prettier] installation
  should read from it automatically.

[git-bisect]: http://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git
[github-issues]: https://github.com/modtree/modtree/issues
[conventional commits guidelines]: https://www.conventionalcommits.org
[feature branch]: https://www.atlassian.com/git/tutorials/comparing-workflows
[complexity:low]: https://github.com/modtree/modtree/issues?q=is%3Aopen+is%3Aissue+label%3Acomplexity%3Alow
[pr-draft]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request
[pr-ready]: https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request
[commit-types]: https://github.com/commitizen/conventional-commit-types/blob/master/index.json
[github actions]: https://github.com/modtree/modtree/actions
[modtree-faq]: http://modtree-docs.vercel.app/docs/faq
[modtree-tests]: http://modtree-docs.vercel.app/docs/developer-guide/tests
[prettier]: https://prettier.io/
