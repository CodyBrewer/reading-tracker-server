const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');

const server = express();

// middleware
server.use(helmet());
server.use(
  cors({
    origin: 'localhost:3000',
  }),
);
server.use(express.json());
server.use(process.env.NODE_ENV === 'production' ? logger('common') : logger('dev'));

module.exports = server;
