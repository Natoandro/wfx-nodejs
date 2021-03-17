const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');

const inputOptions = {
  input: 'src/server/index.ts',
  plugins: [
    typescript({
      target: 'es2017',
      allowSyntheticDefaultImports: true,
      moduleResolution: 'node',
    }),
  ],
  external: ['http', 'fs', 'path', 'url', 'util', 'mime-types', '@hapi/accept'],
};

const outputOptions = {
  dir: 'build/server',
  format: 'cjs',
};

async function server() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}

module.exports = { server };
