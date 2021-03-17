const { src, dest, parallel } = require('gulp');

function statics() {
  return src('src/client/statics/*').pipe(dest('build/client'));
}

const client = parallel(statics);

module.exports = { client };
