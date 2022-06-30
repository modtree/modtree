FROM postgres:alpine

ENV POSTGRES_USER=runner
ENV POSTGRES_PASSWORD=runner

COPY libs/sql/snapshots/mod3.sql /docker-entrypoint-initdb.d/
