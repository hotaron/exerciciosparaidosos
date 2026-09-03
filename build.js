import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and create dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy index.html
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
}

// Copy static dirs
['css', 'images', 'js'].forEach(dir => {
  copyDirSync(path.join(__dirname, dir), path.join(distDir, dir));
});

// Create dist/assets and populate with files from js, images, css
const distAssets = path.join(distDir, 'assets');
fs.mkdirSync(distAssets, { recursive: true });

['js', 'images', 'css'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const srcFile = path.join(dirPath, file);
      const destFile = path.join(distAssets, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
});

// Also create root assets directory for development convenience
const rootAssets = path.join(__dirname, 'assets');
fs.mkdirSync(rootAssets, { recursive: true });
['js', 'images', 'css'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const srcFile = path.join(dirPath, file);
      const destFile = path.join(rootAssets, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
});

console.log('Build completed successfully.');
