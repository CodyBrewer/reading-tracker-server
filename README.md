# Reading Tracker Backend

Backend made up of a Node.js Server, Express.js API & PostgreSQL database set up Knex.js. Used to store data to be used for users to create books lists and tracker their reading progress.

## Endpoints

This project is leveraging the swagger-jsdoc and swagger-ui-express libraries to document the endpoints. Documentation is available on the `/api-docs` route, [Deployed Documentation](https://reading-tracker-be.herokuapp.com/api-docs)

## Local Database Set Up

To set up locally you must have PostgreSQL installed locally. [Download](https://www.postgresql.org/download/)

Once you have PostgreSQL installed locally you will need to create a database, the psql command is `CREATE DATABASE dbname`

After the database is created in your psql service create a .env file in the root with the environment variable `DATABASE_URL` set to your database url. database url example `DATABASE_URL=postgres://postgres@localhost/dbname`

Install node dependencies with the command `npm install`

### Environment variables

This repo uses environment variables to help maintain security. An example of the .env file to get this repo set up:
```
NODE_ENV=development
PORT=1337
DATABASE_URL=postgres://psqlUsername:psqlUserpass@localhost:5432/dbname
SEEDED_PASS_ONE=apassword
SEEDED_PASS_TWO=anotherpassword
SEEDED_PASS_THREE=surpriseAnotherpassword
SALT=10
```

### Data Migrations

Change directories to config folder with command `cd config/`
Run migrations with the command `npx knex migrate:latest`
Migration files are located in `data/migrations` folder.

### Data Seeds

Change directories to config folder with command `cd config/`
Run seeds with the command `npx knex seed:run`
Seed files are located in `data/migrations` folder.
