const appRoot = require('app-root-path');
const path = require('path');

const targetPath = path.join(appRoot.path, '../', '../', 'java', 'evaluations');

const INF_SCROLL = {
  01: {
    marks: 1,
    comment: 'Used Axios call with proper parameters',
  },

  02: {
    marks: 2,
    comment:
      'Used react-infinite-scroll-component for implementing InfiniteScroll',
  },

  03: {
    marks: 1,
    comment: 'Used React hooks',
  },

  04: {
    marks: 1,
    comment: 'Displayed data in tabular format',
  },
};

module.exports = {
  targetPath,
  INF_SCROLL,
};
