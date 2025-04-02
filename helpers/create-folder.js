const fs = require('fs');

function createFolder(path, mask, cb) {
  if (typeof mask == 'function') {
    // Allow the `mask` parameter to be optional
    cb = mask;
    mask = 0777;
  }
  fs.mkdir(path, mask, function (err) {
    if (err) {
      if (err.code == 'EEXIST') cb(null);
      // Ignore the error if the folder already exists
      else cb(err); // Something else went wrong
    } else cb(null); // Successfully created folder
  });
}

module.exports = createFolder;
