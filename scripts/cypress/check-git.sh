ensure_clean_git_status() {
  # ensure a clean git status
  while IFS= read -r line; do
    [[ $line != *'apps/web-e2e/results.json' ]] && RUN=false
  done < <(git status --porcelain)
  # warn user
  [[ $RUN == false && $FORCE == false ]] &&
    cyan 'Please commit all changes before running tests.' && exit 1
}
