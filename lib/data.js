/*
 * Library for storing and manipulating data
 */

const fs = require("fs");
const path = require("path");

/* container to be exported */
const lib = {};
lib.baseDir = path.join(__dirname, "/../.data/");
lib.create = (dir, file, data, callback) => {
  /* Open the file for writing */

  fs.open(`${lib.baseDir}${dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      /* convert data to string */
      const stringData = JSON.stringify(data);

      /* write to file and close it */
      fs.write(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });
    } else {
      callback("Could not create new file, does it already exist?");
    }
  });
};

lib.read = (dir, file, callback) => {
  console.info(`Reading: ${lib.baseDir}${dir}/${file}.json`);
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      /* truncate contents of file before writing new data */
      fs.truncate(fileDescriptor, err => {
        if (!err) {
          /* write to file and close it */
          fs.write(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing file");
                }
              });
            } else {
              callback("Error writing to existing file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Could not open the file for updating");
    }
  });
};

module.exports = lib;
