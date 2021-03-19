import http from 'http';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { contentType } from 'mime-types';

const open = promisify(fs.open);

function setHeaders(response: http.ServerResponse, ...headers: http.OutgoingHttpHeaders[]) {
  for (let set of headers) {
    for (let [name, value] of Object.entries(set)) {
      response.setHeader(name, value);
    }
  }
}

function sendText(
  response: http.ServerResponse,
  status: number,
  text: string = '',
  headers: http.OutgoingHttpHeaders = {}
) {
  const buffer = Buffer.from(text);
  setHeaders(response, 
    { 'Content-Type': 'text/plain', 'Content-Length': buffer.length },
    headers
  );
  response.writeHead(status);
  response.end(buffer);
}

export async function sendClientFile(
  response: http.ServerResponse,
  filename: string,
  headers: http.OutgoingHttpHeaders = {}
) {
  setHeaders(response,
    { 'Content-Type': contentType(filename) || 'application/octet-stream' },
    headers
  );
  
  try {
    // __dirname is build/server because current file is /build/server/index.js
    const fd = await open(path.join(__dirname, '../client', filename), 'r');
    const stream = fs.createReadStream(null, { fd });
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


export function sendJson(
  response: http.ServerResponse,
  object: any,
  headers: http.OutgoingHttpHeaders
) {
  sendText(response, 200, JSON.stringify(object), headers);
}

