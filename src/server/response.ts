import http from 'http';
import { promises as fsPromises, createReadStream } from 'fs';
import path from 'path';
import { contentType } from 'mime-types';

const { open } = fsPromises;

function sendText(
  response: http.ServerResponse,
  status: number,
  text: string = ''
) {
  response.writeHead(status, {
    'Content-Type': 'text/plain',
    'Content-Length': text.length,
  });
  response.end(text);
}

export async function sendClientFile(
  response: http.ServerResponse,
  filename: string
) {
  response.setHeader(
    'Content-Type',
    contentType(filename) || 'application/octet-stream'
  );
  try {
    // __dirname is build/server because current file is /build/server/index.js
    const file = await open(path.join(__dirname, '../client', filename), 'r');
    const stream = createReadStream(null, { fd: file.fd });
    stream.pipe(response, { end: true });
  }
  catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === 'ENOENT') {
      // file not found
      sendText(response, 404, 'File Not Found');
    } else {
      sendText(response, 500);
    }
  }
}

function send404(response: any) {
  const message = 'File Not Found';
  response.writeHead(404, {
    'Content-Type': 'text/plain',
    'Content-Length': message.length,
  });
  response.end(message);
}
