const dbConfig = require("./tenant.config.js");
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

// Determine which config to use for which environment
let config;

switch (process.env.REACT_APP_STAGE) {
  case "development":
    config = dbConfig.devConfig;
    break;
  case "sit":
    config = dbConfig.sitConfig;
    break;
  case "uat":
    config = dbConfig.uatConfig;
    break;
  case "production":
    config = dbConfig.prodConfig;
    break;
  default:
    config = dbConfig.devConfig;
    break;
}

module.exports = { connect };

async function connect(user, password) {
  try {
    console.log("****************** connecting to tenant db: ", user, password);
    const { host, port, database, socketPath } = config;
    const pool = await mysql.createPool({
      connectionLimit: 100,
      host,
      port,
      user,
      password,
      socketPath,
    });

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log(
        "!!!!!!!!!!!!!!!!! tenant db connected as id ",
        connection.threadId
      );
    });

    // connect to db
    console.log(
      "!!!!!!!!!!!!!!!!! connect to tenant db: ",
      database,
      user,
      password
    );
    const sequelize = new Sequelize(
      database,
      user,
      password,
      {
        dialect: "mysql",
        dialectOptions: { decimalNumbers: true, socketPath },
      },
      function (err, results) {
        if (err) throw err;
        console.log("result", results);
      }
    );
    return sequelize;
  } catch (e) {
    console.log("!@##@! Error connecting to database: " + e.message);
    return;
  }
}
