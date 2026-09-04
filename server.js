import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Assets router fallback (serving requested assets from assets, js, images, css)
app.use('/assets', (req, res, next) => {
  const reqPath = decodeURIComponent(req.path);
  const candidates = [
    path.join(__dirname, 'assets', reqPath),
    path.join(__dirname, 'js', reqPath),
    path.join(__dirname, 'images', reqPath),
    path.join(__dirname, 'css', reqPath)
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return res.sendFile(candidate);
    }
  }
  next();
});

// Serve static directories
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/css', express.static(path.join(__dirname, 'css')));
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
}
app.use(express.static(__dirname));

// Fallback to index.html for SPA/HTML routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
