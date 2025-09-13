import copy from 'rollup-plugin-copy';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  platform: 'node',
  dts: true,
  clean: true,
  outDir: 'dist',
  silent: true,
  minify: true,
  treeshake: true,
  plugins: [
    copy({
      targets: [
        { src: 'templates', dest: 'dist' }
      ]
    })
  ],
});
