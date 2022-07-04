FROM postgres:alpine

COPY libs/sql/snapshots/mod3.sql /docker-entrypoint-initdb.d/
