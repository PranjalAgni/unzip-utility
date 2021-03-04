const appRoot = require('app-root-path');
const path = require('path');

const targetPath = path.join(appRoot.path, '../', '../', 'java', 'evaluations');

module.exports = {
  targetPath,
};
