import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseConfig = {
  entryPoints: [path.resolve(__dirname, '../src/client/index.tsx')],
  bundle: true,
  platform: 'browser',
  target: ['es2020'],
  format: 'iife',
  jsx: 'automatic',
  jsxDev: false,
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.ts': 'tsx',
    '.tsx': 'tsx',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    'global': 'globalThis',
  },
  external: [],
  alias: {
    'react': 'react',
    'react-dom': 'react-dom',
  },
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  mainFields: ['browser', 'module', 'main'],
  conditions: ['browser'],
};

const developmentConfig = {
  ...baseConfig,
  outfile: path.resolve(__dirname, '../public/static/bundle.js'),
  sourcemap: true,
  minify: false,
  define: {
    ...baseConfig.define,
    'process.env.NODE_ENV': '"development"',
  },
  jsxDev: true,
};

const productionConfig = {
  ...baseConfig,
  outfile: path.resolve(__dirname, '../public/static/bundle.js'),
  sourcemap: true,
  minify: true,
  define: {
    ...baseConfig.define,
    'process.env.NODE_ENV': '"production"',
  },
  treeShaking: true,
  splitting: false, // Single bundle for now
  drop: ['console', 'debugger'],
};

export {
  developmentConfig,
  productionConfig,
};