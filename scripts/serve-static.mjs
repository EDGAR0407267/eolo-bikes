import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const port = Number.parseInt(process.argv[3] || process.env.PORT || '4321', 10);
const host = process.argv[4] || process.env.HOST || '127.0.0.1';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const resolveRequestPath = async (pathname) => {
  const decodedPath = decodeURIComponent(pathname);
  const requestedPath = resolve(root, `.${decodedPath}`);
  const rootPrefix = root.endsWith(sep) ? root : `${root}${sep}`;

  if (requestedPath !== root && !requestedPath.startsWith(rootPrefix)) {
    return null;
  }

  const requestedStat = await stat(requestedPath).catch(() => null);

  if (requestedStat?.isDirectory()) {
    return join(requestedPath, 'index.html');
  }

  if (requestedStat?.isFile()) {
    return requestedPath;
  }

  if (!extname(requestedPath)) {
    const indexPath = join(requestedPath, 'index.html');
    if (await exists(indexPath)) return indexPath;
  }

  return null;
};

const server = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const url = new URL(request.url, `http://${host}:${port}`);
  const filePath = await resolveRequestPath(url.pathname);

  if (!filePath || !(await exists(filePath))) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Static preview server running at http://${host}:${port}`);
});

const close = () => server.close(() => process.exit(0));

process.on('SIGINT', close);
process.on('SIGTERM', close);
