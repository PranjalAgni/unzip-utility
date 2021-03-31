const path = require('path');
const slash = require('slash');
const { targetPath, DEB } = require('../utils/constants');
const {
  listDirContents,
  isDir,
  readFile,
  writeFile,
  emitCSV,
} = require('../utils/files');

const analyzeCopy = (data) => {
  let marks = 0;
  let comment = [];

  if (data.includes('setTimeout') && data.includes('clearTimeout')) {
    marks += DEB[1].marks;
    comment.push(DEB[1].comment);
  } else {
    comment.push('Debouncing not implemented correctly');
  }

  if (data.includes('search')) {
    marks += DEB[2].marks;
    comment.push(DEB[2].comment);
  }

  if (data.includes('map')) {
    marks += DEB[3].marks;
    comment.push(DEB[3].comment);
  }

  return {
    marks,
    comment,
  };
};

const isCriteriaMet = (projectName) => async (fileList) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fileList.length) return resolve(false);
      let total = 0;
      let comments = [];

      let data = '';
      for (const file of fileList) {
        if (!file.includes('serviceWorker')) {
          data += '\n' + (await readFile(file));
        }
      }

      const { marks, comment } = analyzeCopy(data);
      total += marks;
      comments = comments.concat(comment);

      return resolve({
        total,
        comments,
      });
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

  await Promise.all(
    projectDirs.map(async (project) => {
      const codeFiles = await getAllFiles(project);
      const evaluationFiles = codeFiles.filter(
        (file) => file.includes('.js') || file.includes('.JS')
      );

      const cleanProjectPath = slash(project);
      const projectName = cleanProjectPath.match(/([^\/]*)\/*$/)[1];
      const rollNumber = projectName.split('_')[0];
      const result = await isCriteriaMet(projectName)(evaluationFiles);
      marks[rollNumber] = result;
    })
  );

  const rollNumData = await readFile(
    path.join(__dirname, '../../', 'roll.txt')
  );

  const evaluationsResultList = rollNumData.split('\n').map((rollNum) => {
    if (!marks[rollNum]) {
      return [rollNum, 0, 'He/She has submitted with a wrong file name'];
    }

    const { total, comments } = marks[rollNum];
    return [rollNum, total, comments.join('\n')];
  });

  await Promise.all([
    writeFile('marks.json', JSON.stringify(marks, null, 3)),
    emitCSV(evaluationsResultList),
  ]);

  console.log('Evaluations done = ', evaluationsResultList.length);
};

startEvaluation();
