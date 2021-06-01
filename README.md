# Reading Tracker Backend

Backend made up of a Node.js Server, Express.js API & PostgreSQL database set up using Knex.js. Used to store data to be used for users to create books lists and tracker their reading progress.

## Endpoints

This project is leveraging the swagger-jsdoc and swagger-ui-express libraries to document the endpoints. Documentation is available on the `/api-docs` route, [Deployed Documentation](https://reading-tracker-be.herokuapp.com/api-docs)

## Local Database Set Up

To set up locally you must have PostgreSQL installed locally. [Download](https://www.postgresql.org/download/)

Once you have PostgreSQL installed locally you will need to create a database, the psql command is `CREATE DATABASE dbname`

After the database is created in your psql service create a .env file in the root with the environment variable `DATABASE_URL` set to your database url. database url example `DATABASE_URL=postgres://postgres@localhost/dbname`

## Node Dependencies

Install dependencies with the command `npm install`

### Production Dependencies:

* [bcrypt](https://www.npmjs.com/package/bcrypt): hashes data
* [cors](https://www.npmjs.com/package/cors): enables Cross-origin resource sharing
* [dotenv](https://www.npmjs.com/package/dotenv): loads variables from env file
* [express](https://www.npmjs.com/package/express): minimalist web framework
* [helmet](https://www.npmjs.com/package/helmet): secures http headers
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): implementation of json web tokens
* [knex](https://www.npmjs.com/package/knex): SQL query builder
* [morgan](https://www.npmjs.com/package/morgan): HTTP request logger middleware
* [pg](https://www.npmjs.com/package/pg): PostgreSQL client
* [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc): generates OpenAPI spec from JSDoc -annotated code
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express): Serves swagger-ui generated API docs from OpenAPI Spec
* [uuid](https://www.npmjs.com/package/): creations [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) UUIDs

### Development Dependencies:

* [cypress](https://www.npmjs.com/package/cypress): end-to-end testing tool
* [eslint](https://www.npmjs.com/package/eslint): AST-based pattern checker for JavaScript
* [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard): eslint config that follows [JavaScript Standard Style](https://standardjs.com/)
* [eslint-plugin-cypress](https://www.npmjs.com/package/eslint-plugin-cypress): eslint plugin for cypress
* [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import): eslint plugin for import/export, dependency of eslint-config-standard
* [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node): eslint plugin for node.js, dependency of eslint-config-standard
* [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise):eslint plugin for promises dependency of eslint-config-standard
* [nodemon](https://www.npmjs.com/package/nodemon): Development toll that restarts application when changes are detected

### Environment variables

This repo uses environment variables to help maintain security, allow for easier configuration, and hopefully fewer mistakes in production. 

```bash
// .ENV EXAMPLE
NODE_ENV=development
PORT=1337
DATABASE_URL=postgres://psqlUsername:psqlUserpass@localhost:5432/dbname
SEEDED_PASS_ONE=apassword
SEEDED_PASS_TWO=anotherpassword
SEEDED_PASS_THREE=surpriseAnotherpassword
SALT=525600
```

### Data Migrations

Run migrations with the command `npm run db:migrate`
Migration files are located in `data/migrations` folder.

### Data Seeds

Run seeds with the command `npm run db:seed`
Seed files are located in `data/seeds` folder.
