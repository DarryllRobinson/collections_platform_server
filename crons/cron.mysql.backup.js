const cron = require("node-cron");
const moment = require("moment");
const fs = require("fs");
const spawn = require("child_process").spawn;

const dbConfig = require("../helpers/tenant.config.js");

module.exports = mysqlBackup;

function mysqlBackup() {
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
  // You can adjust the backup frequency as you like, this case will run once a day
  cron.schedule("0 0 * * *", () => {
    const { host, user, password, database } = config;

    const fileName = `${database}_${moment().format("YYYYMMDD")}.sql`;
    const wstream = fs.createWriteStream(__dirname + `/backups/${fileName}`);
    console.log("---------------------");
    console.log("Running Database Backup Cron Job");
    const mysqldump = spawn("mysqldump", [
      "-u",
      user,
      `-p${password}`,
      database,
    ]);

    mysqldump.stdout
      .pipe(wstream)
      .on("finish", () => {
        console.log("DB Backup Completed!");
      })
      .on("error", (err) => {
        console.log(err);
      });
  });
}
