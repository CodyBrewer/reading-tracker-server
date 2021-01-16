require('dotenv').config({ path: '../.env' });

module.exports = {
  development: {
    client: 'pg',
    // connection: process.env.DATABASE_URL,
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: { directory: '../data/migrations' },
    seeds: { directory: '../data/seeds' },
    ssl: true,
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: '../data/migrations' },
    seeds: { directory: '../data/seeds' },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      sslmode: 'require',
    },
    migrations: { directory: '../data/migrations' },
    seeds: { directory: '../data/seeds' },
  },
};
