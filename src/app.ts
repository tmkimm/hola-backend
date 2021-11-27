import express from 'express';
import process from 'process';
import config from './config/index';
import loaders from './loaders/index';

const app: express.Application = express();
global.__rootdir__ = __dirname;
loaders(app);
const server = app.listen(config.port, () => {
  if (typeof process.send === 'function') {
    process.send(`ready`);
  }
});
export default server;
