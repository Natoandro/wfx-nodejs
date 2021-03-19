const { watch, series } = require('gulp');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { restart_server } = require('./server-process');

const serverFiles = ['src/server/*.ts', 'src/common/*.ts'];

async function server() {
  const bundle = await rollup.rollup({
    input: 'src/server/index.ts',
    plugins: [
      typescript({
        tsconfig: 'server.tsconfig.json'
      }),
    ],
    external: [
      'http', 'fs', 'path', 'url', 'util', 'querystring',
      'mime-types', '@hapi/accept'
    ],
  });

  await bundle.write({
    dir: 'build/server',
    format: 'cjs',
  });

  await bundle.close();
}


function server_rebuild() {
  watch(serverFiles, server);
}

function server_dev() {
  watch(serverFiles, series(server, restart_server));
}


module.exports = { server, server_rebuild, server_dev };
