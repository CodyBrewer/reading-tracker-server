require('dotenv').config({ path: '../.env' });

const knex = require('knex');

const dbEnv = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[dbEnv];

module.exports = knex(knexConfig);
