import http from 'http';
import qs from 'querystring';
import { mediaType } from '@hapi/accept';
import env from './env';
import { sendClientFile, sendJson } from './response';
import Explorer from './explorer';

const explorer = new Explorer(process.argv[2]);

async function requestHandler(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const params = url.searchParams;

  const requestedFile = params.get('file');

  if (requestedFile == null) {
    const type = mediaType(request.headers['accept'], [
      'text/html',
      'application/json',
    ]);
    const headers = { 'Vary': 'accept' };
    switch (type) {
      case 'text/html':
        sendClientFile(response, 'index.html', headers);
        return;
      case 'application/json':
        const object = await explorer.getDirectoryContent(qs.unescape(url.pathname));
        sendJson(response, object, headers);
        return;
      default:
        response.writeHead(406, headers);
        response.end();
    }
  }
  else {
    sendClientFile(response, requestedFile);
  }
}

const server = http.createServer(requestHandler);

server.listen(8080, () => {
  console.log(`Server started: port=${env.port}`);
});

server.on('error', (error) => {
  console.error(error);
});
