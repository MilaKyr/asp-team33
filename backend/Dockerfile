FROM postgres:alpine

WORKDIR assets
COPY . /

WORKDIR /
COPY dummy_data.sql /docker-entrypoint-initdb.d/



