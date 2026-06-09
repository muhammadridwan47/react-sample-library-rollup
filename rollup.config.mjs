import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    // 1. Otomatis membaca peerDependencies & memasukkannya ke external
    peerDepsExternal(),
    // 2. Resolve import node_modules & ekstensi TS/JSX
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    // 3. Konversi CJS dependencies ke ESM
    commonjs(),
    // 4. Transpile TypeScript & JSX
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // Biar tidak bentrok dengan proses `tsc` terpisah
      declarationDir: undefined,
    }),
    // 5. Minifikasi production
    terser(),
  ],
};