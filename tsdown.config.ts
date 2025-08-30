
import { defineConfig } from 'tsdown';


export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  platform: 'node',
  dts: false,
  clean: true,
  outDir: 'dist',
  silent: true,
  minify: true,
  treeshake: true,
  sourcemap: 'hidden'
});
