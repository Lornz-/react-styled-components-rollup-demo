import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import autoExternal from 'rollup-plugin-auto-external';
import analyze from 'rollup-plugin-analyzer';
import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const extensions = ['.js', '.jsx'];

export default (async () => ({
  input: pkg.source,
  output: [
    // CommonJS
    { 
      exports: 'named', 
      file: pkg.main, 
      format: 'cjs'             
    },
    // ES
    { 
      exports: 'named', 
      file: pkg.module, 
      format: 'es'
    },
    // UMD
    { 
      exports: 'named', 
      file: pkg.unpkg, 
      format: 'umd',  
      name: 'demo',           
      globals: {
        react: 'React',
        'styled-components': 'styled',
      }
    },
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions,
      plugins: [
        "@babel/plugin-transform-runtime",
        "styled-components",
      ],
      presets: [
        "@babel/preset-env",
        "@babel/preset-react"
      ],
    }),
    resolve(),
    commonjs(),
    autoExternal(),
    isProduction && (await import('rollup-plugin-terser')).terser(),
    analyze({summaryOnly: true}),
  ],
}))();