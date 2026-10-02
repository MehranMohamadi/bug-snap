import { build } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';

async function buildExtension() {
  console.log('🚀 Starting BugSnap extension build...');

  // Step 1: Build HTML pages (popup, report, settings)
  console.log('📦 Step 1: Building Vue UI pages...');
  await build({
    configFile: false,
    base: './',
    plugins: [vue()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: path.resolve('popup.html'),
          report: path.resolve('report.html'),
          settings: path.resolve('settings.html'),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  });

  // Step 2: Build background service worker (ES module)
  console.log('⚙️ Step 2: Bundling background service worker...');
  await build({
    configFile: false,
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: path.resolve('src/background/index.ts'),
        name: 'background',
        formats: ['es'],
        fileName: () => 'background.js',
      },
    },
  });

  // Step 3: Build content script (IIFE)
  console.log('🔌 Step 3: Bundling content script...');
  await build({
    configFile: false,
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: path.resolve('src/content/index.ts'),
        name: 'content',
        formats: ['iife'],
        fileName: () => 'content.js',
      },
    },
  });

  // Step 4: Build injected MAIN world script (IIFE)
  console.log('💉 Step 4: Bundling injected MAIN world hook...');
  await build({
    configFile: false,
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: path.resolve('src/content/injected.ts'),
        name: 'injected',
        formats: ['iife'],
        fileName: () => 'injected.js',
      },
    },
  });

  // Step 5: Copy public assets to dist
  console.log('📋 Step 5: Copying manifest and icons...');
  const publicDir = path.resolve('public');
  const distDir = path.resolve('dist');

  function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      for (const item of fs.readdirSync(src)) {
        copyRecursive(path.join(src, item), path.join(dest, item));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  copyRecursive(publicDir, distDir);

  console.log('✅ BugSnap Chrome Extension successfully built into /dist!');
}

buildExtension().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
