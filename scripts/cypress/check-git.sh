ensure_clean_git_status() {
  # ensure a clean git status
  CLEAN=true
  while IFS= read -r line; do
    [[ $line != *'apps/web-e2e/results.json' ]] && CLEAN=false
  done < <(git status --porcelain)

  [[ $FORCE == true ]] && local force=1
  [[ $CLEAN == true ]] && local clean=1

  # skip all warnings if it's clean
  [ $clean ] && return 0

  warn 'Warning: git status is not clean.'

  # if it's not a force run, then exit
  [ -z $force ] && exit 1
}
