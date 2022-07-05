#!/usr/bin/env bash

# obtain directory of this script
# (to use this you actually have to copy it to the script)
get_root() {
  local script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
  export ROOTDIR=$script_dir/..
}

get_root

# Colors
_N_='\033[0m'     # Reset
_R_='\033[0;31m'  # Red
_G_='\033[0;32m'  # Green
_Y_='\033[0;33m'  # Yellow
_B_='\033[0;34m'  # Blue
_P_='\033[0;35m'  # Purple
_C_='\033[0;36m'  # Cyan
_S_='\033[0;37m'  # Soft (Gray)
