const path = require('path');
const { targetPath, INF_SCROLL } = require('../utils/constants');
const {
  listDirContents,
  isDir,
  readFile,
  writeFile,
} = require('../utils/files');

const analyzeCopy = (data) => {
  let marks = 0;
  let comment = [];

  // const end = data.indexOf('https://picsum.photos');
  // if (end !== -1) {
  //   const start = end - 15;
  //   console.log(data.substring(start, end));
  // }

  if (
    data.includes('fetch(`https://picsum.photos') ||
    data.includes('fetch("https://picsum.photos') ||
    data.includes("fetch('https://picsum.photos")
  ) {
    comment.push('Used fetch() for API Call');
  } else if (data.includes('axios')) {
    marks += INF_SCROLL[1].marks;
    comment.push(INF_SCROLL[1].comment);
  }

  if (data.includes('react-infinite-scroll-component')) {
    marks += INF_SCROLL[2].marks;
    comment.push(INF_SCROLL[2].comment);
  }

  if (data.includes('useState') || data.includes('useEffect')) {
    marks += INF_SCROLL[3].marks;
    comment.push(INF_SCROLL[3].comment);
  }

  if (data.includes('table') || data.includes('Table')) {
    marks += INF_SCROLL[4].marks;
    comment.push(INF_SCROLL[4].comment);
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
      // console.log(project);
      const codeFiles = await getAllFiles(project);
      const evaluationFiles = codeFiles.filter(
        (file) => file.includes('.js') || file.includes('.JS')
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
