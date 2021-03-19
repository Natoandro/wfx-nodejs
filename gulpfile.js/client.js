const { src, dest, parallel, watch } = require('gulp');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

function statics() {
  return src([
    'src/client/statics/*',
    'node_modules/react/umd/react.development.js',
    'node_modules/react-dom/umd/react-dom.development.js'
  ]).pipe(dest('build/client'));
}

async function client_bundle() {
  const bundle = await rollup.rollup({
    input: 'src/client/index.ts',
    plugins: [
      typescript({
        tsconfig: 'client.tsconfig.json'
      }),
      // We are currently using only 'react' and 'react-dom' from node_module
      //nodeResolve(),
      //commonjs(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('development')
        }
      })
    ],
    external: ['react', 'react-dom']
  });

  await bundle.write({
    file: 'build/client/script.js',
    format: 'iife',
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
  });

  await bundle.close();
}

const client = parallel(statics, client_bundle);

function client_rebuild() {
  const watcher = getClientWatcher();
  watcher.on('all', client);
}

function getClientWatcher() {
  return watch('src/client/**/*');
}

module.exports = { client, client_rebuild, getClientWatcher };
