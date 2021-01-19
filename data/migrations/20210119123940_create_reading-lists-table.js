exports.up = (knex) => {
  knex.schema.createTable('reading_lists', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().inTable('users').references('id');
    table.text('name').notNullable();
  });
};

exports.down = (knex) => {
  knex.schema.dropTableIfExists('reading_lists');
};
