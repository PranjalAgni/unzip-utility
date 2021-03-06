const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const unzipper = require('unzipper');
const { targetPath } = require('../utils/constants');

const extractRarFile = async (filename) => {
  try {
    const extractCommand = `cd '${targetPath}' && unrar x '${filename}'`;
    await exec(extractCommand);
  } catch (error) {
    console.error('Unrar error: ', error);
  }
};

const extractZipFile = (fileContents, writeFile) => {
  return new Promise((resolve, reject) => {
    try {
      fileContents
        .pipe(unzipper.Extract({ path: writeFile }))
        .on('close', () => {
          resolve();
        });
    } catch (error) {
      reject(error);
      console.error('Unzip error: ', error);
    }
  });
};

const unzipFile = async (filename) => {
  const readFile = path.join(targetPath, filename);
  const fileContents = fs.createReadStream(readFile);
  const unzipFileName = filename.split('.')[0];
  const writeFile = path.join(targetPath, unzipFileName);

  console.log('WD: ', writeFile);

  if (filename.includes('.zip')) {
    await extractZipFile(fileContents, writeFile);
  } else if (filename.includes('.rar')) {
    await extractRarFile(filename);
  }

  console.log('Extracted and deleting: ', readFile);
  fs.unlink(readFile, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

module.exports = unzipFile;
