require('dotenv').config()
const server = require('./server')

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.info(`server listening on ${PORT}`)
  }
})
