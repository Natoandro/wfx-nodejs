const { parallel, series } = require('gulp');
const { server, server_rebuild, server_dev } = require('./server');
const { client, client_rebuild } = require('./client');
const { start_server } = require('./server-process');

const all = parallel(server, client);

const dev = parallel(
  series(parallel(client, server), start_server), 
  server_dev, client_rebuild
);

module.exports = { server, server_rebuild, client, client_rebuild, all, dev };
