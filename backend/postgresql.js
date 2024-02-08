const { Pool } = require('pg');
const config = require('config');
const database = config.get('database');

let mainPool = null;

function createPool(){
  const pool = new Pool({
    user: database.user,
    host: database.host,
    database: database.database,
    password: database.password,
    port: database.port,
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
