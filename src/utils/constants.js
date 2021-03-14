const appRoot = require('app-root-path');
const path = require('path');

const targetPath = path.join(appRoot.path, '../', '../', 'java', 'evaluations');

const JS = {
  01: {
    marks: 1,
    comment: 'Used Math class to calculate max',
  },

  02: {
    marks: 2,
    comment: 'Used forEach array method for traversal',
  },

  03: {
    marks: 1,
    comment: 'Used other JS array methods',
  },

  04: {
    marks: 0.5,
    comment: 'Used for loop for array traversal',
  },

  05: {
    marks: 1,
    comment: 'Used html table to display data',
  },

  06: {
    marks: 0.5,
    comment: 'Maximum was displayed',
  },
};

module.exports = {
  targetPath,
  JS,
};
