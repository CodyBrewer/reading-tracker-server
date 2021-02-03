module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'reading-tracker-backend',
      version: '0.1.0',
      description: 'reading-tracker-backend',
      license: {
        name: 'MIT',
        url: 'https://en.wikipedia.org/wiki/MIT_License'
      }
    },
    tags: [
      {
        name: 'status',
        description: 'Everything about your status'
      }
    ],
    servers: [
      {
        url: 'https://reading-tracker-be.herokuapp.com',
        description: 'Deployed Production Server'
      },
      {
        url: 'http://localhost:1337',
        description: 'Local Development Server'
      }
    ],
    components: {
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid'
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the result',
                    example: 'Not Found'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./api/routes/*.js']
}
