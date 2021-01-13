const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');
const { notFound, errorHandler } = require('./api/middleware/error');

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

// 404 not found middleware
server.use(notFound);
// error handling middleware
server.use(errorHandler);

module.exports = server;
