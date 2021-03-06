const path = require('path');
const { targetPath, PS } = require('../utils/constants');
const {
  listDirContents,
  isDir,
  readFile,
  writeFile,
} = require('../utils/files');

const isCriteriaMet = async (fileList) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fileList.length) return resolve(false);

      for (const file of fileList) {
        const data = await readFile(file);
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

async function getAllFiles(projectPath) {
  const subdirs = await listDirContents(projectPath);
  const files = await Promise.all(
    subdirs.map((subdir) => {
      const subdirPath = path.resolve(projectPath, subdir);
      return isDir(subdirPath) ? getAllFiles(subdirPath) : subdirPath;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}

const startEvaluation = async () => {
  const fileList = await listDirContents(targetPath);
  const correctFileList = fileList.map((file) => path.join(targetPath, file));
  const projectDirs = correctFileList.filter((filePath) => isDir(filePath));
  const marks = {};

  for (const project of projectDirs) {
    const codeFiles = await getAllFiles(project);
    const javaFiles = codeFiles.filter((file) => file.includes('.java'));
    const result = await isCriteriaMet(javaFiles);
    const projectName = project.match(/([^\/]*)\/*$/)[1];
    marks[projectName] = result;
  }

  console.log(marks);

  await writeFile(JSON.stringify(marks, null, 3));
};

startEvaluation();
