const { parallel } = require('gulp');
const { server } = require('./server');
const { client } = require('./client');

const all = parallel(server, client);

module.exports = { server, client, all };
