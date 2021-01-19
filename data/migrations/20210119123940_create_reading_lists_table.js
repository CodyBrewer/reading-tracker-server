exports.up = (knex) => {
  knex.schema.createTable('reading_lists', (table) => {
    table.increments('id');
    table.text('user_id').unsigned().inTable('users').references('uuid');
    table.text('name').notNullable();
  });
};

exports.down = (knex) => {
  knex.schema.dropTableIfExists('reading_lists');
};
