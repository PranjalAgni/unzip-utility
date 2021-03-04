const getNewFiles = (filesA, filesB) => {
  const getNewFiles = [];
  filesA.forEach((file) => {
    if (!filesB.includes(file)) getNewFiles.push(file);
  });

  return getNewFiles;
};

module.exports = {
  getNewFiles,
};
