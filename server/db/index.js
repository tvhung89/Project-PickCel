import mysql from 'mysql'
import config from '../../config/config'

const pool = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  multipleStatements: true
});

const poolAdmin = mysql.createConnection({
  host: config.databaseAdmin.host,
  user: config.databaseAdmin.user,
  password: config.databaseAdmin.password,
  database: config.databaseAdmin.database,
  multipleStatements: true
});

// Connect
pool.connect(error => {
  if (error) {
      throw "Can't connect to MySQL: " + error;
  } else {
    console.log('MySQL Connected!');
  }
});

poolAdmin.connect(error => {
  if (error) {
      throw "Can't connect to MySQL Admin: " + error;
  } else {
    console.log('MySQL Admin Connected!');
  }
});

export default {
  pool,
  poolAdmin
}