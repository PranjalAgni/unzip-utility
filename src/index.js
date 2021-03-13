const unzipFile = require('./lib/unzip');
const { targetPath } = require('./utils/constants');
const { getNewFiles, listDirContents } = require('./utils/files');

let filesUnzipped = [];

const unzipFiles = (fileList) => {
  fileList.forEach((file) => {
    filesUnzipped.push(file);
    unzipFile(file);
  });
};

const main = async () => {
  let files = await listDirContents(targetPath);
  files = files.filter(
    (file) => file.includes('.zip') || file.includes('.rar')
  );
  console.log('Files: ', files);

  setInterval(async () => {
    files = await listDirContents(targetPath);
    files = files.filter(
      (file) => file.includes('.zip') || file.includes('.rar')
    );
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
