#!/usr/bin/env node

import esbuild from 'esbuild';
import { productionConfig, developmentConfig } from './esbuild.config.js';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.argv.includes('--watch');

const config = isProduction ? productionConfig : developmentConfig;

// Ensure output directory exists
const outputDir = path.dirname(config.outfile || config.outdir);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function build() {
  try {
    console.log(`Building for ${isProduction ? 'production' : 'development'}...`);
    const startTime = Date.now();

    if (isWatch) {
      const context = await esbuild.context(config);
      await context.watch();
      console.log('👀 Watching for changes...');
    } else {
      const result = await esbuild.build(config);
      const endTime = Date.now();
      
      console.log(`✅ Build completed in ${endTime - startTime}ms`);
      
      if (result.metafile) {
        console.log('📊 Bundle analysis:', await esbuild.analyzeMetafile(result.metafile));
      }
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();