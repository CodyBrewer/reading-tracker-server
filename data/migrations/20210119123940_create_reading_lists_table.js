exports.up = (knex) =>
  knex.schema.createTable('reading_lists', (table) => {
    table.increments('id');
    table
      .uuid('user_id')
      .unsigned()
      .notNullable()
      .references('uuid')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.text('name').notNullable();
  });

exports.down = (knex) => {
  knex.schema.dropTableIfExists('reading_lists');
};
