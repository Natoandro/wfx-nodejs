const { watch } = require('gulp');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');

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
  const watcher = getServerWatcher();
  watcher.on('all', server);
}


function getServerWatcher() {
  return watch('src/server/*.ts');
}


module.exports = { server, server_rebuild, getServerWatcher };
