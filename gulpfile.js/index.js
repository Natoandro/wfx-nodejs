const { parallel, series } = require('gulp');
const { server, server_rebuild, getServerWatcher } = require('./server');
const { client, client_rebuild } = require('./client');
const { restart_server, start_server } = require('./server-process');

const all = parallel(server, client);

function server_dev() {
  const watcher = getServerWatcher();
  watcher.on('all', series(server, restart_server));
}

const dev = parallel(
  series(parallel(client, server), start_server), 
  server_dev, client_rebuild
);

module.exports = { server, server_rebuild, client, client_rebuild, all, dev };
