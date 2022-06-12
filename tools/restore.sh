#!/usr/bin/env bash

restore_from_args() {
  psql $1 < $2
}

print_help() {
cat <<EOF

USAGE:
psql [database] < [sql dump file]

EXAMPLE: 
psql my_cool_database < i_dumped_the_file_the_file_didnt_dump_me.sql

EOF
}

if [ $1 ] && [ $2 ]; then
  restore_from_args $1 $2
else
  print_help
fi
