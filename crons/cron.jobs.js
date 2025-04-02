const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const convert = require('xml-js');

const db = require('../helpers/db');
const inforService = require('./infor.controller');
const mysqlBackup = require('./cron.mysql.backup');

// Schedule for cron jobs
// second (optional) | minute | hour | day of month | month | day of week
// Example
//cron.schedule('1,2,4,5 * * * *', () => {
//console.log('running every minute 1, 2, 4 and 5');
//});
//Steps are also permitted after an asterisk, so if you want to say “every two minutes”, just use */2

unlockCollections();
//fetchInfor();
mysqlBackup();

function unlockCollections() {
  cron.schedule('*/15 * * * *', () => {
    console.log(
      '******************************** running unlockCollections now'
    );
    db.Case.update(
      { currentStatus: 'Open' },
      { where: { currentStatus: 'Locked' } }
    );
  });
}

function fetchInfor() {
  cron.schedule('*/10 * * * *', async () => {
    const fileLocation = __dirname + '/infor/test.xml';
    fs.readFile(fileLocation, 'utf8', (err, data) => {
      //console.log('data', data.toString());
      const finalData = convert.xml2json(data, {
        compact: true,
        spaces: 4,
      });
      console.log('finalData: ', finalData);
    });
  });
}

function oldfetchInfor() {
  cron.schedule('*/10 * * * * *', async () => {
    console.log('******************************** running fetchInfor now');
    const data = await axios.post(
      'http://localhost:4000/api/infor/retrieve-xml',
      { location: '/infor/test.xml' }
    );
    console.log('received data: ', data);
    //const url = 'https://jsonplaceholder.typicode.com/posts/1';
    //getData(url);
    //getFile();
  });
}

async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
