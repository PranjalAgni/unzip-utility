const appRoot = require('app-root-path');
const path = require('path');

const targetPath = path.join(appRoot.path, '../', '../', 'java', 'evaluations');

const HTCS = {
  01: {
    marks: 2,
    comment: 'Use of HTML table tags like tr , td , etc.',
  },

  02: {
    marks: 1,
    comment: 'Followed clean code standards',
  },

  03: {
    marks: 0.5,
    comment: 'Not used inline styling',
  },

  04: {
    marks: 1,
    comment: 'Proper styling has been done, using different CSS properties',
  },
};

module.exports = {
  targetPath,
  HTCS,
};
