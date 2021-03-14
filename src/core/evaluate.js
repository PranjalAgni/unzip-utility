const path = require('path');
const { targetPath, JS } = require('../utils/constants');
const {
  listDirContents,
  isDir,
  readFile,
  writeFile,
} = require('../utils/files');

const analyzeCopy = (data, context) => {
  let marks = 0;
  let comment = [];
  const { name, numFiles } = context;

  marks += 0.5;
  comment.push('Input data taken from JSON');

  if (data.includes('Math.max')) {
    marks += JS[1].marks;
    comment.push(JS[1].comment);
  }

  if (data.includes('forEach')) {
    marks += JS[2].marks;
    comment.push(JS[2].comment);
  } else if (
    data.includes('.map') ||
    data.includes('.filter') ||
    data.includes('.reduce')
  ) {
    marks += JS[3].marks;
    comment.push(JS[3].comment);
  } else if (data.includes('for (') || data.includes('for(')) {
    marks += JS[4].marks;
    comment.push(JS[4].comment);
  }

  if (data.includes('table') || data.includes('TABLE')) {
    marks += JS[5].marks;
    comment.push(JS[5].comment);
  }

  if (data.includes('innerHTML')) {
    marks += JS[6].marks;
    comment.push(JS[6].comment);
  }

  if (numFiles >= 2) {
    comment.push('Clean code, splitted JS and HTML logic');
  } else {
    comment.push('Code can be improved, everything written in single file');
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

      const context = {
        name: projectName,
        numFiles: fileList.length,
      };

      let data = '';
      for (const file of fileList) {
        data += '\n' + (await readFile(file));
      }

      const { marks, comment } = analyzeCopy(data, context);
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
      // console.log(project);
      const codeFiles = await getAllFiles(project);
      const evaluationFiles = codeFiles.filter(
        (file) =>
          file.includes('.html') || file.includes('.js') || file.includes('.JS')
      );

      const projectName = project.match(/([^\/]*)\/*$/)[1];
      const result = await isCriteriaMet(projectName)(evaluationFiles);
      marks[projectName] = result;
    })
  );

  console.log(Object.keys(marks).length);

  await writeFile(JSON.stringify(marks, null, 3));
};

startEvaluation();
