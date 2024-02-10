FROM postgres:alpine

WORKDIR assets
COPY data/assets/ .

WORKDIR /
COPY data/tables_config.sql /docker-entrypoint-initdb.d/



