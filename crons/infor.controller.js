const express = require('express');
const router = express.Router();
//const xmlparser = require('express-xml-bodyparser');
const path = require('path');
const fs = require('fs');

router.post('/retrieve-xml', getInfor);

module.exports = router;

function getInfor(req, res, next) {
  const { location } = req.body;
  const fileLocation = __dirname + location;
  console.log('getInfor: ', fileLocation);

  fs.readFile(fileLocation, (err, data) => {
    if (err) res.status(500).send(err);
    //console.log('data: ', data);
    res
      .contentType('application/xml')
      .send(`data:application/xml; base64,${xmlparser(data)}`);
  });
  //getFile(location);

  /*'/receive-xml',
    xmlparser({ trim: false, explicitArray: false }),
    function (req, res, next) {
      // check req.body
    };*/
}

function getFile(req, res, next, location) {
  const fileLocation =
    '/Users/darryllrobinson/Documents/projects/diycollections_server/src/crons/invoices/ref001/First Customer-20210829.pdf'; //path.resolve(__dirname, location);
  console.log('getFile from ', fileLocation);
  fs.readFile(fileLocation, (err, data) => {
    if (err) res.status(500).send(err);
    console.log('data: ', data);
    //res.contentType('application/xml').send(xmlparser({ trim: false, explicitArray: false }));
  });
}
