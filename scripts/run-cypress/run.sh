#!/usr/bin/env bash

# Reset
_N_='\033[0m'    # Reset
_R_='\033[0;31m' # Red
_G_='\033[0;32m' # Green
_Y_='\033[0;33m' # Yellow
_B_='\033[0;34m' # Blue
_P_='\033[0;35m' # Purple
_C_='\033[0;36m' # Cyan
_S_='\033[0;37m' # Soft (Gray)

SPEC_DIR=apps/web-e2e/cypress/integration

# this script requires fd and fzf

TARGET=$(fd --full-path $SPEC_DIR -t f | fzf)

if [ $TARGET ]; then
  yarn nx run web-e2e:e2e:nw \
    --skip-nx-cache \
    --spec $TARGET
else
  printf "\n${_Y_}No test selected.${_N_}\n\n"
fi
