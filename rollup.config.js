import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['src/index.js'],
  output: [{
    name: 'MapboxAccessibility',
    file: 'dist/mapbox-gl-accessibility.js',
    format: 'umd',
    sourcemap: true,
    indent: false,
  }, {
    name: 'MapboxAccessibility',
    file: 'examples/mapbox-gl-accessibility.js',
    format: 'umd',
    sourcemap: true,
    indent: false,
  }],
  treeshake: true,
  plugins: [
    // rollup requires a babel passthrough to transpile special
    // proposed "class properties" syntax
    babel(),
    resolve(),
    commonjs(),
  ],
};
