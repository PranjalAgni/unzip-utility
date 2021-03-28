const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const unzipper = require('unzipper');
const { targetPath } = require('../utils/constants');

const deleteFile = (fileName) => {
  fs.unlink(fileName, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

const shellCmdExecutor = (basePath) => async (cmd) =>
  await exec(`cd '${basePath}' && ${cmd}`);

const extractRarFile = async (filename, dirname) => {
  try {
    const sh = shellCmdExecutor(targetPath);
    await sh(`mkdir ${dirname}`);
    const moveFile = `mv '${filename}' ${dirname}`;
    await sh(moveFile);
    const extractCommand = `cd ${dirname} && unrar x '${filename}'`;
    await sh(extractCommand);
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
  let fileToDelete = readFile;

  console.log('WD: ', writeFile);

  if (filename.includes('.zip')) {
    await extractZipFile(fileContents, writeFile);
  } else if (filename.includes('.rar')) {
    const dirname = filename.split(/_W5D1/gi)[0];
    await extractRarFile(filename, `'${dirname}'`);
    fileToDelete = path.join(targetPath, dirname, filename);
  }

  console.log('Extracted and deleting: ', fileToDelete);
  deleteFile(fileToDelete);
};

module.exports = unzipFile;
