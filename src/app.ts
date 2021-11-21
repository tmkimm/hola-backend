import express from 'express';
import config from './config/index';
import loaders from './loaders/index';

const app: express.Application = express();
global.__rootdir__ = __dirname;
loaders(app);
const server = app.listen(config.port);
export default server;
