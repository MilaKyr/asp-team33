const { Pool } = require('pg');
const config = require('./config');

let mainPool = null;

function createPool(){
  const pool = new Pool({
    user: config.postgres.user,
    host: config.postgres.host,
    database: config.postgres.database,
    password: config.postgres.password,
    port: config.postgres.port,
  });
  return pool;
}

function getPool(){
  if(!mainPool){
    mainPool = createPool();
  }
  return mainPool;
}

module.exports = { getPool };
