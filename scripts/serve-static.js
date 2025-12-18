// Simple static file server for local testing
// Usage: node serve-static.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = parseInt(process.argv[2], 10) || 3000;
const root = path.resolve(__dirname, '..');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.php': 'text/plain'
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURI(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(root, urlPath);
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, {'Content-Type':'text/plain'});
        return res.end('Not found');
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.writeHead(200, {'Content-Type': type});
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  } catch (e) {
    res.writeHead(500, {'Content-Type':'text/plain'});
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
});
