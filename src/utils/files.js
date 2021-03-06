const fs = require('fs');

const getNewFiles = (filesA, filesB) => {
  const getNewFiles = [];
  filesA.forEach((file) => {
    if (!filesB.includes(file)) getNewFiles.push(file);
  });

  return getNewFiles;
};

const listDirContents = (targetPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(targetPath, (err, files) => {
      if (err) reject(err);

      resolve(files);
    });
  });
};

const isDir = (filePath) => {
  return fs.lstatSync(filePath).isDirectory();
};

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const writeFile = (resultJSON) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('marks.json', resultJSON, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  getNewFiles,
  listDirContents,
  isDir,
  readFile,
  writeFile,
};
