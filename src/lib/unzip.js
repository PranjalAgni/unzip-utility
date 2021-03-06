const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const unzipper = require('unzipper');
const { targetPath } = require('../utils/constants');

const extractRarFile = async (readFile, writeFile) => {
  try {
    const extractCommand = `cd '${targetPath}' && unrar x '${readFile}'`;
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
    await extractRarFile(readFile, writeFile);
  }

  fs.unlink(readFile, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

module.exports = unzipFile;
