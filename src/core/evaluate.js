const path = require('path');
const { targetPath, HTCS } = require('../utils/constants');
const {
  listDirContents,
  isDir,
  readFile,
  writeFile,
} = require('../utils/files');

const analyzeCopy = (data, context) => {
  let marks = 0;
  let comment = [];
  const { type, name, numFiles } = context;
  if (type === 'html') {
    if (data.includes('tr') && data.includes('td')) {
      marks += 3;
      comment.push(HTCS[1].comment, HTCS[2].comment);
    }
    if (data.includes('style=') || data.includes('style =')) {
      if (numFiles === 1) {
        console.log('Used of inline styling: ', name);
        comment.push('Used inline styling');
      }
    } else {
      marks += 0.5;
      comment.push(HTCS[3].comment);
    }
  } else if (type === 'css') {
    if (data.includes('background-color') && data.includes('font-size')) {
      marks += 1;
      comment.push(HTCS[4].comment);
    } else {
      comment.push('Styling can be done better');
    }
  }

  if (type === 'html' && numFiles === 1) {
    if (data.includes('background-color') && data.includes('font-size')) {
      marks += 1;
      comment.push(HTCS[4].comment);
    } else {
      comment.push(
        'CSS properties not used for background-color and font-size is not used'
      );
    }
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
      for (const file of fileList) {
        const data = await readFile(file);

        const context = {
          name: projectName,
          type: file.endsWith('html') ? 'html' : 'css',
          numFiles: fileList.length,
        };

        const { marks, comment } = analyzeCopy(data, context);
        total += marks;
        comments = comments.concat(comment);
      }

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
        (file) => file.includes('.html') || file.includes('.css')
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
