const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const jsdocConfig = require('./config/jsdoc');
const { notFound, errorHandler } = require('./api/middleware/error');
// ###[Routers]###
const statusRouter = require('./api/routes/status');

const swaggerSpec = swaggerJSDoc(jsdocConfig);
const swaggerUIOptions = {
  explorer: true,
};

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

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions));

// application routes
server.use('/status', statusRouter);

// 404 not found middleware
server.use(notFound);
// error handling middleware
server.use(errorHandler);

module.exports = server;
