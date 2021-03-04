const fs = require('fs');

const getFiles = (targetPath) => {
  const fileList = [];
  return new Promise((resolve, reject) => {
    fs.readdir(targetPath, (err, files) => {
      if (err) reject(err);
      files.forEach((file) => {
        if (file.includes('.zip') || file.includes('.rar')) fileList.push(file);
      });

      resolve(fileList);
    });
  });
};

module.exports = {
  getFiles,
};
