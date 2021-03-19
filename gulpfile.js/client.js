const { src, dest, parallel, watch } = require('gulp');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

const staticFiles = ['src/client/statics/**/*'];
const scriptFiles = [
  'src/client/**/*.ts',
  'src/client/**/*.tsx',
  'src/common/**/*.ts'
];

function statics() {
  return src([
    ...staticFiles,
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
  watch(staticFiles, statics);
  watch(scriptFiles, client_bundle);
}

module.exports = { client, client_rebuild };
