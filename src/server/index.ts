import http from 'http';
import env from './env';
import { sendClientFile } from './response';

function requestHandler(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const params = url.searchParams;

  const requestedFile = params.get('file');

  if (requestedFile == null) {
    sendClientFile(response, 'index.html');
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
