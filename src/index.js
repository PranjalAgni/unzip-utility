const fs = require('fs');
const unzipFile = require('./lib/unzip');
const reader = require('./lib/reader');
const { targetPath } = require('./utils/constants');
const { getNewFiles } = require('./utils/files');

let filesUnzipped = [];

const unzipFiles = (fileList) => {
  fileList.forEach((file) => {
    filesUnzipped.push(file);
    unzipFile(file);
  });
};

const main = async () => {
  let files = await reader.getFiles(targetPath);
  console.log('Files: ', files);

  setInterval(async () => {
    files = await reader.getFiles(targetPath);
    const newFiles = getNewFiles(files, filesUnzipped);
    if (newFiles.length > 0) {
      console.log('New Files: ', newFiles);
      unzipFiles(newFiles);
    } else {
      console.log('No new files found yet');
    }
  }, 2000);
};

main();
