const path = require('path');
const { targetPath, PS } = require('../utils/constants');
const { getFiles, isDir, readFile } = require('../utils/files');

const isCriteriaMet = async (basePath, fileList) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fileList.length) return resolve(false);

      for (const file of fileList) {
        const data = await readFile(path.join(basePath, file));
        if (data.includes(PS)) {
          return resolve(true);
        }
      }

      return resolve(false);
    } catch (err) {
      return reject(err);
    }
  });
};

const startEvaluation = async () => {
  const fileList = await getFiles(targetPath);
  const correctFileList = fileList.map((file) => path.join(targetPath, file));
  const projectDirs = correctFileList.filter((filePath) => isDir(filePath));
  for (const project of projectDirs) {
    const codeFiles = await getFiles(project);
    const javaFiles = codeFiles.filter((file) => file.includes('.java'));
    const result = await isCriteriaMet(project, javaFiles);
    const name = project.match(/([^\/]*)\/*$/)[1];
    console.log(`${name} : ${result}`);
  }
};

startEvaluation();
