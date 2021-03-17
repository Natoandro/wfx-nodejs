const { src, dest, parallel, watch } = require('gulp');

function statics() {
  return src('src/client/statics/*').pipe(dest('build/client'));
}

const client = parallel(statics);

function client_rebuild() {
  const watcher = getClientWatcher();
  watcher.on('all', client);
}

function getClientWatcher() {
  return watch('src/client/**/*');
}

module.exports = { client, client_rebuild, getClientWatcher };
