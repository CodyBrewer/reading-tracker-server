exports.up = (knex) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('avatar_url').notNullable();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('users');
