const appRoot = require('app-root-path');
const path = require('path');

const targetPath = path.join(appRoot.path, '../', '../', 'java', 'evaluations');

const DEB = {
  01: {
    marks: 3,
    comment: 'Debouncing implemented properly, with correct timeout',
  },

  02: {
    marks: 1,
    comment: 'Search functionality is working correctly',
  },

  03: {
    marks: 1,
    comment: 'UI is according to the requirement',
  },
};

module.exports = {
  targetPath,
  DEB,
};
