const { spawn } = require('child_process');

class ServerProcess {

  start() {
    this.process = spawn('node', ['build/server/index.js']);
    this.handleEvents();
    this.redirectStdio();
  }

  handleEvents() {
    this.process.on('error', (err) => {
      console.error(`Error on server process: ${err}`);
    });

    this.process.on('exit', (code, signal) => {
      console.log(`  Server process terminated with code ${code}...`);
      if (signal) console.log(`    Signal: ${signal}`);
    });
  }

  redirectStdio() {
    this.process.stdout.on('data', data => {
      process.stdout.write(`server: ${data}`);
    });
    this.process.stderr.on('data', data => {
      process.stderr.write(`server*: ${data}`);
    });
  }

  restart() {
    return new Promise((resolve) => {
      if (this.process == null) {
        this.start();
        resolve();
      }
      else {
        this.process.once('exit', () => {
          this.start();
          resolve();
        })
        this.process.kill('SIGINT');
      }

    });
  }
  
}

const server = new ServerProcess();

async function start_server() {
  server.start();
}

async function restart_server() {
  await server.restart();
}

module.exports = { start_server, restart_server };
