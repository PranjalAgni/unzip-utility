const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const unzip = require('unrar');
const { targetPath } = require('../utils/constants');

const extractRarFile = async (fileReadStream, writeFile) => {
  try {
    fileReadStream.pipe(unzip.Parse()).on('entry', (entry) => {
      console.log(entry.path);
    });
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
    fs.unlink(readFile, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  } else if (filename.includes('.rar')) {
    await extractRarFile(fileContents, writeFile);
  }
};

module.exports = unzipFile;
