const fs = require('fs');
const Papa = require('papaparse');

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

const writeFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const emitCSV = (data) => {
  const columns = ['Roll', 'Marks', 'Comments'];
  const csv = Papa.unparse({
    fields: columns,
    data: data,
  });

  return writeFile('results.csv', csv);
};

module.exports = {
  getNewFiles,
  listDirContents,
  isDir,
  readFile,
  writeFile,
  emitCSV,
};
