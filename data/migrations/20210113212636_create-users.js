exports.up = (knex) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.uuid('uuid').unique().notNullable();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('avatar_url').notNullable();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('users');
