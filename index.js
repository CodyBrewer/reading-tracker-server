require('dotenv').config();
const server = require('./server');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info(`server listening on ${PORT}`);
  }
});
