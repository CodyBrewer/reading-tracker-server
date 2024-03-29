const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const jsdocConfig = require('./config/jsdoc');
const { notFound, errorHandler } = require('./api/middleware/error.middleware');
// ###[Routers]###
const statusRouter = require('./api/routes/status.router');
const authenticationRouter = require('./api/routes/authentication.router');
const profileRouter = require('./api/routes/profiles.router');
const readingListRouter = require('./api/routes/readingLists.router');
const { verifyToken } = require('./api/middleware/authentication.middleware');

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

// application routes
server.use('/status', statusRouter);
server.use('/auth', authenticationRouter);
server.use('/profiles', verifyToken, profileRouter);
server.use(['/readingLists', '/*/*/readingLists'], verifyToken, readingListRouter);
server.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions));

// 404 not found middleware
server.use(notFound);
// error handling middleware
server.use(errorHandler);

module.exports = server;
