#!/usr/bin/env bash

# start the service
sudo systemctl start postgresql.service

# prep the sql commands to run
cat << EOF >> /tmp/setup.sql
CREATE USER runner PASSWORD 'runner';
ALTER ROLE runner WITH CREATEDB;
ALTER ROLE runner WITH SUPERUSER;
EOF

# run them as the `postgres` user
sudo su postgres -c "psql --file=/tmp/setup.sql"

# create databases for testing
createdb mt_test
