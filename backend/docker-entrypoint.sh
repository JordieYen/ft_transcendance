#!/bin/sh

chown -R postgres:postgres /docker-entrypoint-initdb.d/

exec "$@"
